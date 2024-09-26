package handlers

import (
	"fttt/internal/db/repositories"
	"github.com/gin-gonic/gin"
	"net/http"
)

type GameHandler struct {
	GameRepository *repositories.GameRepository
}

func NewGameHandler(gameRepo *repositories.GameRepository) *GameHandler {
	return &GameHandler{
		GameRepository: gameRepo,
	}
}

func (gameHandler *GameHandler) CreateGame(ctx *gin.Context) {
		game := gameHandler.GameRepository.Create();

		ctx.JSON(http.StatusOK, game)
}
