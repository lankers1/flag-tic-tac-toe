package websockets

import (
	"fmt"
	"github.com/lankers1/fttt/internal/handlers"
)

type M struct {
	Client *Client 
	UserId string
}

//Hub is a struct that holds all the clients and the messages that are sent to them
type Hub struct {
	// Registered clients.
	clients map[*Client]bool
	//Unregistered clients.
	unregister chan *Client
	// Register requests from the clients.
	register chan *Client
	// Inbound messages from the clients.
	broadcast chan Message
	players []M
}

//Message struct to hold message data
type Message struct {
	Type      string  `json:"type"`
}

func NewHub() *Hub {
	return &Hub{
		clients:    make(map[*Client]bool),
		unregister: make(chan *Client),
		register:   make(chan *Client),
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
	h.clients[client] = true
	fmt.Println("Size of clients: ", len(h.clients))
}

//function to remvoe client from room
func (h *Hub) RemoveClient(client *Client) {
	delete(h.clients, client)
	close(client.send)
	fmt.Println("Removed client")
}

//function to handle message based on type of message
func (h *Hub) HandleMessage(message Message, handlers *handlers.Handlers) {
	if message.Type == "message" {
		if len(h.players) > 1 {
			gameId := handlers.GameHandler.OnlineGame()

			for _, player := range h.players[0: 2] {
				client := player.Client
				send := client.send
				select {
					case send <- gameId:
					default:
						close(send)
						delete(h.clients, client)
					}
			}
		}
	}
}
