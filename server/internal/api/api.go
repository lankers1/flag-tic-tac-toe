package api

import (
	"github.com/lankers1/fttt/internal/handlers"
	"github.com/lankers1/fttt/internal/websockets"
	"github.com/gin-gonic/gin"
	cors "github.com/rs/cors/wrapper/gin"
)

func InitApi(httpHandlers *handlers.Handlers) *gin.Engine {
	router := gin.Default()
	c := cors.New(cors.Options{
    AllowedOrigins: []string{"http://localhost:8000", "https://flag-tic-tac-toe.it.com"},
    AllowCredentials: true,
	})


	hub := websockets.NewHub()
	go hub.Run(httpHandlers)

	router.Use(c)

	router.GET("/game", httpHandlers.GameHandler.CreateGame)
	router.GET("/game/:gameId", httpHandlers.GameHandler.GetOnlineGame)
	router.POST("/search_flags", httpHandlers.FlagHandler.SearchFlags)
	router.POST("/register", httpHandlers.AuthHandler.Register)
	router.GET("/ws", func(c *gin.Context) {
		websockets.ServeWS(c, hub, httpHandlers)
	})

	router.GET("/ws/game/:gameId", func(c *gin.Context) {
		gameId := c.Param("gameId")

		websockets.ServeGameWS(c, gameId, hub, httpHandlers)
	})


	return router
}
 