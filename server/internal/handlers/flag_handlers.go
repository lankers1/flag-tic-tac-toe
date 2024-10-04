package handlers

import (
	"github.com/lankers1/fttt/internal/db/repositories"
	"github.com/gin-gonic/gin"
	"net/http"
)

type FlagHandler struct {
	FlagRepository *repositories.FlagRepository
}

func NewFlagHandler(flagRepo *repositories.FlagRepository) *FlagHandler {
	return &FlagHandler{
		FlagRepository: flagRepo,
	}
}

type searchBody struct {
	SearchTerm string `json:"search_term"`
}

func (flagHandler *FlagHandler) SearchFlags(ctx *gin.Context) {
	var body searchBody

	if err := ctx.BindJSON(&body); err != nil {
			return
	}
	
	countries := flagHandler.FlagRepository.SearchFlags(body.SearchTerm);

	ctx.JSON(http.StatusOK, countries)
}
