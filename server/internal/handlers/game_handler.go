package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/lankers1/fttt/internal/db/repositories"
	"github.com/lankers1/fttt/internal/models"
)

type CreateGameRes struct {
	Game    *models.Game   `json:"game"`
	Answers *models.Answer `json:"answers"`
}

type CreateOnlineGameRes struct {
	Game    *models.OnlineGameBoard `json:"game"`
	Answers *models.Answer          `json:"answers"`
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
	game, gameCreationError := gameHandler.GameRepository.Create()

	if gameCreationError != nil {
		ctx.AbortWithStatusJSON(gameCreationError.Code, gameCreationError.Message)
		return
	}

	answers, getAnswersError := gameHandler.GameRepository.GetAnswers(game)

	if getAnswersError != nil {
		ctx.AbortWithStatusJSON(getAnswersError.Code, getAnswersError.Message)
		return
	}

	res := CreateGameRes{Game: game, Answers: answers}

	ctx.JSON(http.StatusOK, res)
}

func (gameHandler *GameHandler) OnlineGame(players []string) *models.OnlineGame {
	game, gameCreationError := gameHandler.GameRepository.Create()

	if gameCreationError != nil {
		return nil
	}

	gameId, err := gameHandler.GameRepository.OnlineGame(game, players)

	if err != nil {
		return nil
	}

	return gameId
}

func (gameHandler *GameHandler) GetOnlineGame(ctx *gin.Context) {
	gameId := ctx.Param("gameId")

	game, onlineGameErr := gameHandler.GameRepository.GetOnlineGame(gameId)

	if onlineGameErr != nil {
		ctx.AbortWithStatusJSON(onlineGameErr.Code, onlineGameErr.Message)
		return
	}

	answers, answersErr := gameHandler.GameRepository.GetAnswers(game.Board)

	if answersErr != nil {
		ctx.AbortWithStatusJSON(answersErr.Code, answersErr.Message)
		return
	}

	res := CreateOnlineGameRes{Game: game, Answers: answers}
	ctx.JSON(http.StatusOK, res)
}

func (gameHandler *GameHandler) UpdateWinner(ctx *gin.Context) {
	gameId := ctx.Param("gameId")
	username := ctx.Param("username")

	err := gameHandler.GameRepository.UpdateWinner(gameId, username)

	if err != nil {
		ctx.AbortWithStatusJSON(err.Code, err.Message)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{})
}
