package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/lankers1/fttt/internal/db/repositories"
	"github.com/lankers1/fttt/internal/models"
)

type AuthHandler struct {
	AuthRepository *repositories.AuthRepository
}

func NewAuthHandler(authRepo *repositories.AuthRepository) *AuthHandler {
	return &AuthHandler{
		AuthRepository: authRepo,
	}
}

func (authHandler *AuthHandler) Register(ctx *gin.Context) {
	var body models.Registration

	if err := ctx.BindJSON(&body); err != nil {
		return
	}

	user, err := authHandler.AuthRepository.Register(body)

	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, err)
		return
	}

	ctx.JSON(http.StatusOK, user)
}

func (authHandler *AuthHandler) Login(ctx *gin.Context) {
	var body models.Login

	if err := ctx.BindJSON(&body); err != nil {
		return
	}

	user, err := authHandler.AuthRepository.Login(body)

	if err != nil {
		ctx.AbortWithStatusJSON(err.Code, err.Messages)
		return
	}

	ctx.JSON(http.StatusOK, user)
}
