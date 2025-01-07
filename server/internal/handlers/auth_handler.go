package handlers

import (
	"github.com/lankers1/fttt/internal/db/repositories"
	"github.com/lankers1/fttt/internal/models"
	"github.com/gin-gonic/gin"
	"net/http"
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
	
	countries := authHandler.AuthRepository.Register(body);

	ctx.JSON(http.StatusOK, countries)
}
