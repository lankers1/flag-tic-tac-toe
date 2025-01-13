package repositories

import "github.com/jackc/pgx/v5/pgxpool"

type Repositories struct {
	GameRepository *GameRepository
	FlagRepository *FlagRepository
	AuthRepository *AuthRepository
	UserRepository *UserRepository
}

func NewRepositories(db *pgxpool.Pool) *Repositories {
	return &Repositories{
		GameRepository: NewGameRepository(db),
		FlagRepository: NewFlagRepository(db),
		AuthRepository: NewAuthRepository(db),
		UserRepository: NewUserRepository(db),
	}
}
