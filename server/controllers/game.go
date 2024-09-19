package controllers

import (
 "github.com/gin-gonic/gin"
 "net/http"
 "fttt/services"
)

type GameController struct {
 service *services.GameService
}

func InitGameController(s *services.GameService) *GameController {
 return &GameController{s}
}

func (c *GameController) GetGame(ctx *gin.Context) {
 game, err := c.service.GetGame()
 if err != nil {
  ctx.JSON(http.StatusNotFound, gin.H{"error": "Game not found"})
  return
 }

 ctx.JSON(http.StatusOK, game)

}
