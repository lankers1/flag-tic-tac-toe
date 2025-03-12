package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/lankers1/fttt/internal/db/repositories"
	"github.com/lankers1/fttt/internal/models"
)

type GetUserRes struct {
	User *models.User `json:"user"`
}

type UserHandler struct {
	UserRepository *repositories.UserRepository
}

func NewUserHandler(userRepo *repositories.UserRepository) *UserHandler {
	return &UserHandler{
		UserRepository: userRepo,
	}
}

func (userHandler *UserHandler) GetUser(ctx *gin.Context) {
	username := ctx.Param("username")
	user := userHandler.UserRepository.GetUser(username)

	res := GetUserRes{User: user}

	ctx.JSON(http.StatusOK, res)
}

func (userHandler *UserHandler) UpdateScore(ctx *gin.Context) {
	username := ctx.Param("username")

	var body *models.UpdateScoreBody

	if err := ctx.BindJSON(&body); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"message": "Missing fields: " + err.Error()})
		return
	}

	user, err := userHandler.UserRepository.UpdateScore(username, body)

	if err != nil {
		ctx.AbortWithStatusJSON(err.Code, err.Message)
		return
	}

	ctx.JSON(http.StatusOK, user)
}

func (userHandler *UserHandler) GetUsers(ctx *gin.Context) {
	var body *models.GetUsersBody

	if err := ctx.BindJSON(&body); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Something went wrong" + err.Error()})
		return
	}

	users, err := userHandler.UserRepository.GetUsers(body.Offset)

	if err != nil {
		ctx.AbortWithStatusJSON(err.Code, err.Message)
		return
	}

	ctx.JSON(http.StatusOK, users)
}

func (userHandler *UserHandler) UpdateFavouriteFlag(ctx *gin.Context) {
	username := ctx.Param("username")
	var body *models.UpdateFavouriteFlagBody

	if err := ctx.BindJSON(&body); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Something went wrong" + err.Error()})
		return
	}

	user, err := userHandler.UserRepository.UpdateFavouriteFlag(username, body)

	if err != nil {
		ctx.AbortWithStatusJSON(err.Code, err.Message)
		return
	}

	ctx.JSON(http.StatusOK, user)
}
