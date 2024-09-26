package api

import (
	"fttt/internal/handlers"
	"github.com/gin-gonic/gin"
	cors "github.com/rs/cors/wrapper/gin"
)

func InitApi(handlers *handlers.Handlers) *gin.Engine {
	router := gin.Default()
	router.Use(cors.Default())

	router.GET("/game", handlers.GameHandler.CreateGame)

	return router
}
