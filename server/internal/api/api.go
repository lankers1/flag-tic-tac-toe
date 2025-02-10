package api

import (
	"github.com/lankers1/fttt/internal/handlers"
	"github.com/lankers1/fttt/internal/middleware"
	"github.com/lankers1/fttt/internal/websockets"

	"github.com/gin-gonic/gin"
	cors "github.com/rs/cors/wrapper/gin"
)

func InitApi(httpHandlers *handlers.Handlers) *gin.Engine {
	router := gin.New()
	router.Use(gin.Recovery())
	router.Use(middleware.LoggingMiddleware())

	c := cors.New(cors.Options{
		AllowedMethods:   []string{"GET", "POST", "PATCH"},
		AllowedOrigins:   []string{"http://localhost:8000", "https://flag-tic-tac-toe.it.com"},
		AllowCredentials: true,
	})

	hub := websockets.NewHub()
	go hub.Run(httpHandlers)

	router.Use(c)

	router.GET("/game", httpHandlers.GameHandler.CreateGame)
	router.GET("/game/:gameId", httpHandlers.GameHandler.GetOnlineGame)
	router.POST("/game/:gameId/winner/:username", httpHandlers.GameHandler.UpdateWinner)

	router.POST("/search_flags", httpHandlers.FlagHandler.SearchFlags)

	router.POST("/register", httpHandlers.AuthHandler.Register)
	router.POST("/login", httpHandlers.AuthHandler.Login)

	router.GET("/users", httpHandlers.UserHandler.GetUsers)
	router.GET("/user/:username", httpHandlers.UserHandler.GetUser)
	router.PATCH("/user/:username", httpHandlers.UserHandler.UpdateScore)

	router.GET("/ws/:username", func(c *gin.Context) {
		username := c.Param("username")

		websockets.ServeWS(c, username, hub, httpHandlers)
	})

	router.GET("/ws/game/:username/:gameId", func(c *gin.Context) {
		gameId := c.Param("gameId")
		username := c.Param("username")

		websockets.ServeGameWS(c, gameId, username, hub, httpHandlers)
	})

	return router
}
