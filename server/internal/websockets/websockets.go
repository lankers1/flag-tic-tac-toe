package websockets

import 	(
	"github.com/gorilla/websocket"
	"slices"
	"net/http"
	"time"
	"github.com/gin-gonic/gin"
	"fmt"
	"github.com/lankers1/fttt/internal/handlers"
	"github.com/lankers1/fttt/internal/models"
)


const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024, 
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		origin := r.Header.Get("Origin")
		allowedOrigins := []string{"http://localhost:8000", "https://flag-tic-tac-toe.it.com"}
    return  slices.Contains(allowedOrigins, origin)
	},
 }

 type Client struct {
	Conn *websocket.Conn
	send chan *models.OnlineGame
	sendAnswer chan Message
	sendGameMetadata chan Metadata
	hub  *Hub
	Channel string
}

type Metadata struct {
	Type string `json:"type"`
	PlayerTurn int `json:"playerTurn"`
}


func NewClient(channel string, conn *websocket.Conn, hub *Hub) *Client {
	return &Client{Conn: conn, Channel: channel, sendGameMetadata: make(chan Metadata, 256), sendAnswer: make(chan Message, 256), send: make(chan *models.OnlineGame, 256), hub: hub}
}


func (c *Client) Read() {
	defer func() {
		c.hub.unregister <- c
		c.Conn.Close()
	}()
	c.Conn.SetReadLimit(maxMessageSize)
	c.Conn.SetReadDeadline(time.Now().Add(pongWait))
	c.Conn.SetPongHandler(func(string) error { c.Conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		var msg Message
		err := c.Conn.ReadJSON(&msg)
		if err != nil {
			fmt.Println("Error: ", err)
			break
		}
		c.hub.broadcast <- msg
	}
}

func (c *Client) Write(handlers *handlers.Handlers) {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.Conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			} else {
				err := c.Conn.WriteJSON(message)
        delete(c.hub.clients["general"], c)
				if err != nil {
					fmt.Println("Error: ", err)
					break
				}
			}
		case message, ok := <-c.sendAnswer:
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			} else {
				err := c.Conn.WriteJSON(message)
				if err != nil {
					fmt.Println("Error: ", err)
					break
				}
			}
		case message, ok := <-c.sendGameMetadata:
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			} else {
				err := c.Conn.WriteJSON(message)
				if err != nil {
					fmt.Println("Error: ", err)
					break
				}
			}
		case <-ticker.C: 
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}

	}
}

func (c *Client) Close() {
	close(c.send)
}

func ServeWS(ctx *gin.Context, hub *Hub, handlers *handlers.Handlers) {
	ws, err := upgrader.Upgrade(ctx.Writer, ctx.Request, nil)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	client := NewClient("general", ws, hub)

	hub.register <- client
	go client.Write(handlers)
	go client.Read()
}


func ServeGameWS(ctx *gin.Context, gameId string, hub *Hub, handlers *handlers.Handlers) {
	ws, err := upgrader.Upgrade(ctx.Writer, ctx.Request, nil)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	client := NewClient(gameId, ws, hub)

	hub.registerNewGame <- client
	go client.Write(handlers)
	go client.Read()
}
