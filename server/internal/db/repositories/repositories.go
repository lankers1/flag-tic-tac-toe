package repositories

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repositories struct {
	GameRepository *GameRepository
	FlagRepository *FlagRepository
	AuthRepository *AuthRepository
	UserRepository *UserRepository
}

func NewRepositories(db *pgxpool.Pool, ctx context.Context) *Repositories {
	return &Repositories{
		GameRepository: NewGameRepository(db, ctx),
		FlagRepository: NewFlagRepository(db, ctx),
		AuthRepository: NewAuthRepository(db, ctx),
		UserRepository: NewUserRepository(db, ctx),
	}
}
