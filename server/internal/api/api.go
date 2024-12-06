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
	router.POST("/search_flags", httpHandlers.FlagHandler.SearchFlags)
	router.GET("/ws/:userId", func(c *gin.Context) {
		userId := c.Param("userId")

		websockets.ServeWS(c, userId, hub, httpHandlers)
	})

	return router
}
 