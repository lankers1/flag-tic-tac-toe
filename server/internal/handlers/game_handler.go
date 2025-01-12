package handlers

import (
	"github.com/lankers1/fttt/internal/db/repositories"
	"github.com/gin-gonic/gin"
	"github.com/lankers1/fttt/internal/models"
	"net/http"
)

type CreateGameRes struct {
	Game *models.Game `json:"game"`
	Answers *models.Answer `json:"answers"`
}

type CreateOnlineGameRes struct {
	Game *models.OnlineGameBoard `json:"game"`
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

func (gameHandler *GameHandler) OnlineGame(players []string) *models.OnlineGame {
	game := gameHandler.GameRepository.Create();
	gameId := gameHandler.GameRepository.OnlineGame(game, players);
	
	return gameId
}

func (gameHandler *GameHandler) GetOnlineGame(ctx *gin.Context) {
	gameId := ctx.Param("gameId")

	game := gameHandler.GameRepository.GetOnlineGame(gameId);
	answers := gameHandler.GameRepository.GetAnswers(game.Board)

	res := CreateOnlineGameRes{Game: game, Answers: answers}
	ctx.JSON(http.StatusOK, res)
}
