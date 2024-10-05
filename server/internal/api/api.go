package api

import (
	"github.com/lankers1/fttt/internal/handlers"
	"github.com/gin-gonic/gin"
	cors "github.com/rs/cors/wrapper/gin"
)

func InitApi(handlers *handlers.Handlers) *gin.Engine {
	router := gin.Default()
	c := cors.New(cors.Options{
    AllowedOrigins: []string{"http://localhost:8000", "https://flag-tic-tac-toe.it.com"},
    AllowCredentials: true,
})

	router.Use(c)

	router.GET("/game", handlers.GameHandler.CreateGame)
	router.POST("/search_flags", handlers.FlagHandler.SearchFlags)

	return router
}
