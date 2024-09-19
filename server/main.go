package main

import (
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
	"fmt"
	"os"
	"context"
	"fttt/controllers"
	"fttt/repositories"
	"fttt/services"
	"log"
)

func goDotEnvVariable(key string) string {
  err := godotenv.Load(".env")

  if err != nil {
    fmt.Printf("Error loading .env file")
  }

  return os.Getenv(key)
}

func main() {
	conn, err := pgx.Connect(context.Background(), goDotEnvVariable("DATABASE_URL"))
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}

	defer conn.Close(context.Background())

	r := gin.Default()
	gameRepo := repositories.InitGameRepository(conn)
	gameService := services.InitGameService(gameRepo)
	gameController := controllers.InitGameController(gameService)

	r.GET("/game", gameController.GetGame)
	rErr := r.Run()

	if rErr != nil {
	 log.Fatalf("Could not run server: %v", rErr)
	}
}
