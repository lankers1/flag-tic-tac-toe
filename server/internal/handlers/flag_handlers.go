package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/lankers1/fttt/internal/db/repositories"
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
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"message": "Missing fields: " + err.Error()})
		return
	}

	countries, err := flagHandler.FlagRepository.SearchFlags(body.SearchTerm)

	if err != nil {
		ctx.AbortWithStatusJSON(err.Code, err.Message)
		return
	}

	ctx.JSON(http.StatusOK, countries)
}

type searchCharacteristicsBody struct {
	SearchTerm      string   `json:"search_term"`
	Characteristics []string `json:"characteristics"`
}

func (flagHandler *FlagHandler) SearchFlagCharacteristics(ctx *gin.Context) {
	var body searchCharacteristicsBody

	if err := ctx.BindJSON(&body); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"message": "Missing fields: " + err.Error()})
		return
	}

	countries, err := flagHandler.FlagRepository.SearchFlagCharacteristics(body.SearchTerm, body.Characteristics)

	if err != nil {
		ctx.AbortWithStatusJSON(err.Code, err.Message)
		return
	}

	ctx.JSON(http.StatusOK, countries)
}
