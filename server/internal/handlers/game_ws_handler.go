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
	"strconv"
	"sync"
	"time"

	"github.com/lankers1/fttt/internal/db/repositories"

	"github.com/coder/websocket"
	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

type GameWebsocketHandler struct {
	subscriberMessageBuffer int
	publishLimiter          *rate.Limiter
	logf                    func(f string, v ...interface{})
	subscribersMu           sync.Mutex
	subscribers             map[string]map[*subscriber]struct{}
	playAgain               map[string][]string
	gameRepo                *repositories.GameRepository
}

func NewGameWebsocketHandler(gameRepo *repositories.GameRepository) *GameWebsocketHandler {
	return &GameWebsocketHandler{
		subscriberMessageBuffer: 16,
		logf:                    log.Printf,
		subscribers:             make(map[string]map[*subscriber]struct{}),
		publishLimiter:          rate.NewLimiter(rate.Every(time.Millisecond*100), 8),
		playAgain:               make(map[string][]string),
		gameRepo:                gameRepo,
	}
}

func (cs *GameWebsocketHandler) SubscribeHandler(ctx *gin.Context) {
	username := ctx.Param("username")
	gameId := ctx.Param("gameId")

	err := cs.subscribe(ctx.Writer, ctx.Request, username, gameId)

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

func (cs *GameWebsocketHandler) PublishHandler(ctx *gin.Context) {
	if ctx.Request.Method != "POST" {
		http.Error(ctx.Writer, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
		return
	}

	gameId := ctx.Param("gameId")
	body := http.MaxBytesReader(ctx.Writer, ctx.Request.Body, 8192)

	msg, err := io.ReadAll(body)
	if err != nil {
		http.Error(ctx.Writer, http.StatusText(http.StatusRequestEntityTooLarge), http.StatusRequestEntityTooLarge)
		return
	}

	cs.publish(msg, gameId)

	ctx.Writer.WriteHeader(http.StatusAccepted)
}

func (cs *GameWebsocketHandler) PublishPlayAgainHandler(ctx *gin.Context) {
	if ctx.Request.Method != "POST" {
		http.Error(ctx.Writer, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
		return
	}
	username := ctx.Param("username")
	gameId := ctx.Param("gameId")
	body := http.MaxBytesReader(ctx.Writer, ctx.Request.Body, 8192)

	msg, err := io.ReadAll(body)
	if err != nil {
		http.Error(ctx.Writer, http.StatusText(http.StatusRequestEntityTooLarge), http.StatusRequestEntityTooLarge)
		return
	}

	cs.publishPlayAgain(msg, gameId, username)

	ctx.Writer.WriteHeader(http.StatusAccepted)
}

func (cs *GameWebsocketHandler) subscribe(w http.ResponseWriter, r *http.Request, username string, gameId string) error {
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
	cs.addSubscriber(s, gameId)
	defer cs.deleteSubscriber(s, gameId)

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

func (cs *GameWebsocketHandler) publish(msg []byte, gameId string) {
	cs.subscribersMu.Lock()
	defer cs.subscribersMu.Unlock()

	cs.publishLimiter.Wait(context.Background())
	for s := range cs.subscribers[gameId] {
		select {
		case s.msgs <- msg:
		default:
			go s.closeSlow()
		}
	}
}

type Message struct {
	Type   string `json:"type"`
	GameId string `json:"gameId"`
}

func (cs *GameWebsocketHandler) publishPlayAgain(msg []byte, gameId string, username string) {
	cs.subscribersMu.Lock()
	defer cs.subscribersMu.Unlock()

	cs.publishLimiter.Wait(context.Background())

	cs.playAgain[gameId] = append(cs.playAgain[gameId], username)
	fmt.Println(len(cs.playAgain[gameId]))
	if len(cs.playAgain[gameId]) > 1 {

		game, _ := cs.gameRepo.Create()

		generatedGameId, _ := cs.gameRepo.OnlineGame(game, cs.playAgain[gameId])

		clients := cs.subscribers[gameId]

		message := Message{GameId: strconv.Itoa(generatedGameId.GameId), Type: "play-again"}
		newFsConfigBytes, _ := json.Marshal(message)

		for s := range clients {
			select {
			case s.msgs <- newFsConfigBytes:
			default:
				go s.closeSlow()
			}
		}
	}
}

func (cs *GameWebsocketHandler) addSubscriber(s *subscriber, gameId string) {
	cs.subscribersMu.Lock()

	connections := cs.subscribers[gameId]
	if connections == nil {
		connections = make(map[*subscriber]struct{})
		cs.subscribers[gameId] = connections
	}
	cs.subscribers[gameId][s] = struct{}{}
	cs.subscribersMu.Unlock()
}

func (cs *GameWebsocketHandler) deleteSubscriber(s *subscriber, gameId string) {
	cs.subscribersMu.Lock()
	delete(cs.subscribers[gameId], s)
	cs.subscribersMu.Unlock()
}
