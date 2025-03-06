package api

import (
	"github.com/lankers1/fttt/internal/handlers"
	"github.com/lankers1/fttt/internal/middleware"

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

	router.Use(c)

	router.GET("/ws/search-game/:username", httpHandlers.GameSearchWebsocketHandler.SubscribeHandler)
	router.POST("/ws/search-game", httpHandlers.GameSearchWebsocketHandler.PublishHandler)

	router.GET("/ws/game/:gameId/:username", httpHandlers.GameWebsocketHandler.SubscribeHandler)
	router.POST("/ws/game/:gameId/:username", httpHandlers.GameWebsocketHandler.PublishHandler)
	router.POST("/ws/game/:gameId/:username/play-again", httpHandlers.GameWebsocketHandler.PublishPlayAgainHandler)

	router.GET("/game", httpHandlers.GameHandler.CreateGame)
	router.GET("/game/:gameId", httpHandlers.GameHandler.GetOnlineGame)
	router.POST("/game/:gameId/winner/:username", httpHandlers.GameHandler.UpdateWinner)

	router.POST("/search_flags", httpHandlers.FlagHandler.SearchFlags)

	router.POST("/register", httpHandlers.AuthHandler.Register)
	router.POST("/login", httpHandlers.AuthHandler.Login)

	router.POST("/users", httpHandlers.UserHandler.GetUsers)
	router.GET("/user/:username", httpHandlers.UserHandler.GetUser)
	router.PATCH("/user/:username", httpHandlers.UserHandler.UpdateScore)

	return router
}
