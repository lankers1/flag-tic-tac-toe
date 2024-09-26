package repositories

import "github.com/jackc/pgx/v5"

type Repositories struct {
	GameRepository *GameRepository
}

func NewRepositories(db *pgx.Conn) *Repositories {
	return &Repositories{
		GameRepository: NewGameRepository(db),
	}
}
