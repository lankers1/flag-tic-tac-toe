package websockets

import (
	"github.com/lankers1/fttt/internal/handlers"
	"fmt"
)

type M struct {
	Client *Client 
}

//Hub is a struct that holds all the clients and the messages that are sent to them
type Hub struct {
	clients map[string]map[*Client]bool
  gameClients map[string]map[*Client]bool
	unregister chan *Client
	register chan *Client
  registerNewGame chan *Client
	broadcast chan Message
	players []M
}

type Cell struct {
	Row int `json:"row"`
	Col int `json:"col"`
}

//Message struct to hold message data
type Message struct {
	Type      string  `json:"type"`
	IsCorrect bool `json:"isCorrect"`
	GameId string `json:"gameId"`
	FlagIso string `json:"flagIso"`
	Name string `json:"name"`
	Player int `json:"player"`
	Cell Cell `json:"cell"`
	Answer string `json:"answer"`
}

func NewHub() *Hub {
	return &Hub{
		gameClients: make(map[string]map[*Client]bool),
		clients:    make(map[string]map[*Client]bool),
		unregister: make(chan *Client),
		register:   make(chan *Client),
    registerNewGame: make(chan *Client),
		broadcast:  make(chan Message),
		players: []M{},
	}
}

//Core function to run the hub
func (h *Hub) Run(handlers *handlers.Handlers) {
	for {
		select {
		// Register a client.
		case client := <-h.register:
			h.RegisterNewClient(client)

    case client := <-h.registerNewGame:
			h.RegisterNewGameClient(client)
			// Unregister a client.
		case client := <-h.unregister:
			h.RemoveClient(client)
			// Broadcast a message to all clients.
		case message := <-h.broadcast:
			//Check if the message is a type of "message"
			h.HandleMessage(message, handlers)
		}
	}
}

//function check if room exists and if not create it and add client to it
func (h *Hub) RegisterNewClient(client *Client) {
	connections := h.clients["general"]
	if connections == nil {
		connections = make(map[*Client]bool)
		h.clients["general"] = connections
	} 
	h.clients["general"][client] = true
}

func (h *Hub) RegisterNewGameClient(client *Client) {

	connections := h.gameClients[client.Channel]
	if connections == nil {
		connections = make(map[*Client]bool)
		h.gameClients[client.Channel] = connections
	}
	h.gameClients[client.Channel][client] = true

  message := Metadata{PlayerTurn: len(h.gameClients[client.Channel]), Type: "metadata"}
  sendGameMetadata := client.sendGameMetadata
  select {
    case sendGameMetadata <- message:
    default:
      close(sendGameMetadata)
      delete(h.gameClients[client.Channel], client)
    }
}

func (h *Hub) RemoveClient(client *Client) {
	if _, ok := h.clients["general"]; ok {
		delete(h.clients["general"], client)
	}
	if _, ok := h.gameClients[client.Channel]; ok {
		delete(h.gameClients[client.Channel], client)
		close(client.send)
	}
}

//function to handle message based on type of message
func (h *Hub) HandleMessage(message Message, handlers *handlers.Handlers) {
	fmt.Println(message)
	if message.Type == "search" {
		if len(h.players) > 1 {
			gameId := handlers.GameHandler.OnlineGame()

			for _, player := range h.players {
				client := player.Client
				send := client.send
				h.players = []M{}
				select {
					case send <- gameId:
					default:
						close(send)
						delete(h.clients["general"], client)
					}
			}
		}
	}
  if message.Type == "turn" {
		clients := h.gameClients[message.GameId]

		for client := range clients {
				sendAnswer := client.sendAnswer
				select {
					case sendAnswer <- message:
					default:
						close(sendAnswer)
						delete(h.gameClients[message.GameId], client)
					}
			}
	}
}
