package config

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"github.com/lankers1/fttt/internal/db/repositories"
	"github.com/lankers1/fttt/internal/handlers"
)

type Config struct {
	DatabaseUrl string
}

func InitConfig() Config {
	err := godotenv.Load(".env")

	if err != nil {
		log.Printf("Error loading .env file")
	}

	config := Config{DatabaseUrl: os.Getenv("DATABASE_URL")}

	return config
}

func InitRepositories(conn *pgxpool.Pool, ctx context.Context) *repositories.Repositories {
	return repositories.NewRepositories(conn, ctx)
}

func InitHandlers(repo *repositories.Repositories) *handlers.Handlers {
	return handlers.NewHandlers(repo.GameRepository, repo.FlagRepository, repo.AuthRepository, repo.UserRepository)
}
