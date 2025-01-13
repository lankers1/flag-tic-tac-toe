package handlers

import (
	"github.com/lankers1/fttt/internal/db/repositories" 	
)

type Handlers struct {
	GameHandler *GameHandler
	FlagHandler *FlagHandler
	AuthHandler *AuthHandler
	UserHandler *UserHandler
}

func NewHandlers(gameRepo *repositories.GameRepository, flagRepo *repositories.FlagRepository, authRepo *repositories.AuthRepository, userRepo *repositories.UserRepository) *Handlers {
	return &Handlers{
		GameHandler: NewGameHandler(gameRepo),
		FlagHandler: NewFlagHandler(flagRepo),
		AuthHandler: NewAuthHandler(authRepo),
		UserHandler: NewUserHandler(userRepo),
	}
}
