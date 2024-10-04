package handlers

import "github.com/lankers1/fttt/internal/db/repositories"

type Handlers struct {
	GameHandler *GameHandler
	FlagHandler *FlagHandler
}

func NewHandlers(gameRepo *repositories.GameRepository, flagRepo *repositories.FlagRepository) *Handlers {
	return &Handlers{
		GameHandler: NewGameHandler(gameRepo),
		FlagHandler: NewFlagHandler(flagRepo),
	}
}
