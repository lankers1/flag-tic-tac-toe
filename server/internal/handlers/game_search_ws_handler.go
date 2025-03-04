package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"sync"
	"time"

	"github.com/lankers1/fttt/internal/db/repositories"
	"golang.org/x/time/rate"

	"github.com/coder/websocket"
	"github.com/gin-gonic/gin"
)

type GameSearchWebsocketHandler struct {
	subscriberMessageBuffer int
	publishLimiter          *rate.Limiter
	logf                    func(f string, v ...interface{})
	subscribersMu           sync.Mutex
	subscribers             map[*subscriber]struct{}
	gameRepo                *repositories.GameRepository
}

func NewGameSearchWebsocketHandler(gameRepo *repositories.GameRepository) *GameSearchWebsocketHandler {
	return &GameSearchWebsocketHandler{
		subscriberMessageBuffer: 16,
		logf:                    log.Printf,
		subscribers:             make(map[*subscriber]struct{}),
		publishLimiter:          rate.NewLimiter(rate.Every(time.Millisecond*100), 8),
		gameRepo:                gameRepo,
	}
}

type subscriber struct {
	username  string
	msgs      chan []byte
	closeSlow func()
}

func (cs *GameSearchWebsocketHandler) SubscribeHandler(ctx *gin.Context) {
	username := ctx.Param("username")
	err := cs.subscribe(ctx.Writer, ctx.Request, username)

	if errors.Is(err, context.Canceled) {
		return
	}
	if websocket.CloseStatus(err) == websocket.StatusNormalClosure ||
		websocket.CloseStatus(err) == websocket.StatusGoingAway {
		return
	}
	if err != nil {
		cs.logf("%v", err)
		return
	}
}

func (cs *GameSearchWebsocketHandler) PublishHandler(ctx *gin.Context) {
	if ctx.Request.Method != "POST" {
		http.Error(ctx.Writer, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
		return
	}
	body := http.MaxBytesReader(ctx.Writer, ctx.Request.Body, 8192)

	msg, err := io.ReadAll(body)
	if err != nil {
		http.Error(ctx.Writer, http.StatusText(http.StatusRequestEntityTooLarge), http.StatusRequestEntityTooLarge)
		return
	}

	cs.publish(msg)

	ctx.Writer.WriteHeader(http.StatusAccepted)
}

func (cs *GameSearchWebsocketHandler) subscribe(w http.ResponseWriter, r *http.Request, username string) error {
	var mu sync.Mutex
	var c *websocket.Conn
	var closed bool
	s := &subscriber{
		username: username,
		msgs:     make(chan []byte, cs.subscriberMessageBuffer),
		closeSlow: func() {
			mu.Lock()
			defer mu.Unlock()
			closed = true
			if c != nil {
				c.Close(websocket.StatusPolicyViolation, "connection too slow to keep up with messages")
			}
		},
	}
	cs.addSubscriber(s)
	defer cs.deleteSubscriber(s)

	c2, err := websocket.Accept(w, r, &websocket.AcceptOptions{
		OriginPatterns: []string{"*"},
	})
	if err != nil {
		return err
	}
	mu.Lock()
	if closed {
		mu.Unlock()
		return net.ErrClosed
	}
	c = c2
	mu.Unlock()
	defer c.CloseNow()

	ctx := c.CloseRead(context.Background())

	if len(cs.subscribers) > 1 {
		r := []string{}
		for v, _ := range cs.subscribers {
			r = append(r, v.username)
		}

		game, gameCreationError := cs.gameRepo.Create()

		if gameCreationError != nil {
			fmt.Println(gameCreationError, "gameCreationError")
			return nil
		}

		gameId, err := cs.gameRepo.OnlineGame(game, r)

		if err != nil {
			fmt.Println(err, "err")
			return nil
		}

		newFsConfigBytes, _ := json.Marshal(gameId)

		cs.publish(newFsConfigBytes)
	}

	for {
		select {
		case msg := <-s.msgs:
			err := writeTimeout(ctx, time.Second*5, c, msg)
			if err != nil {
				return err
			}
		case <-ctx.Done():
			return ctx.Err()
		}
	}
}

func (cs *GameSearchWebsocketHandler) publish(msg []byte) {
	cs.subscribersMu.Lock()
	defer cs.subscribersMu.Unlock()

	cs.publishLimiter.Wait(context.Background())

	for s := range cs.subscribers {
		select {
		case s.msgs <- msg:
		default:
			go s.closeSlow()
		}
	}
}

func (cs *GameSearchWebsocketHandler) addSubscriber(s *subscriber) {
	cs.subscribersMu.Lock()
	cs.subscribers[s] = struct{}{}
	cs.subscribersMu.Unlock()
}

func (cs *GameSearchWebsocketHandler) deleteSubscriber(s *subscriber) {
	cs.subscribersMu.Lock()
	delete(cs.subscribers, s)
	cs.subscribersMu.Unlock()
}

func writeTimeout(ctx context.Context, timeout time.Duration, c *websocket.Conn, msg []byte) error {
	ctx, cancel := context.WithTimeout(ctx, timeout)
	defer cancel()

	return c.Write(ctx, websocket.MessageText, msg)
}
