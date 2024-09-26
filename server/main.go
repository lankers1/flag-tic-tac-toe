package main

import (
	"fttt/internal/config"
	"fttt/internal/db"
	"fttt/internal/api"
	"log"
	"context"
)

func main() {
	cfg := config.InitConfig()

	conn := db.Connect(cfg.DatabaseUrl)

	defer conn.Close(context.Background())

	handlers := config.InitHandlers(config.InitRepositories(conn))

	api := api.InitApi(handlers)

	err := api.Run()

	if err != nil {
	 log.Fatalf("Could not run server: %v", err)
	}
}
