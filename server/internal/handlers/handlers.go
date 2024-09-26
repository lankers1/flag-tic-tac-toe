package handlers

import "fttt/internal/db/repositories"

type Handlers struct {
	GameHandler *GameHandler
}

func NewHandlers(gameRepo *repositories.GameRepository) *Handlers {
	return &Handlers{
		GameHandler: NewGameHandler(gameRepo),
	}
}
