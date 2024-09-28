package handlers

import (
	"fttt/internal/db/repositories"
	"github.com/gin-gonic/gin"
	"fttt/internal/models"
	"net/http"
)

type CreateGameRes struct {
	Game *models.Game `json:"game"`
	Answers *models.Answer `json:"answers"`
}

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
		answers := gameHandler.GameRepository.GetAnswers(game)

		res := CreateGameRes{Game: game, Answers: answers}
		
		ctx.JSON(http.StatusOK, res)
}
