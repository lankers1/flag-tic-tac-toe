package handlers

import (
	"github.com/lankers1/fttt/internal/db/repositories" 	
)

type Handlers struct {
	GameHandler *GameHandler
	FlagHandler *FlagHandler
	AuthHandler *AuthHandler
}

func NewHandlers(gameRepo *repositories.GameRepository, flagRepo *repositories.FlagRepository, authRepo *repositories.AuthRepository) *Handlers {
	return &Handlers{
		GameHandler: NewGameHandler(gameRepo),
		FlagHandler: NewFlagHandler(flagRepo),
		AuthHandler: NewAuthHandler(authRepo),
	}
}
