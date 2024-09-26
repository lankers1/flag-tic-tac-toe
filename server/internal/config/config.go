package config

import (
	"os"
	"log"
	"github.com/joho/godotenv"
	"github.com/jackc/pgx/v5"
	"fttt/internal/db/repositories"
	"fttt/internal/handlers"
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

func InitRepositories(conn *pgx.Conn) *repositories.Repositories {
	return repositories.NewRepositories(conn)
}

func InitHandlers(repo *repositories.Repositories) *handlers.Handlers {
	return handlers.NewHandlers(repo.GameRepository)
}
