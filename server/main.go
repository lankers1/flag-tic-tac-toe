package main

import (
	"context"
	"log"

	"github.com/lankers1/fttt/internal/api"
	"github.com/lankers1/fttt/internal/config"
	"github.com/lankers1/fttt/internal/db"
)

func main() {
	cfg := config.InitConfig()

	rootCtx, cancel := context.WithCancel(context.Background())
	defer cancel()

	conn := db.Connect(cfg.DatabaseUrl, rootCtx)

	defer conn.Close()

	handlers := config.InitHandlers(config.InitRepositories(conn, rootCtx))

	api := api.InitApi(handlers)

	err := api.Run()

	if err != nil {
		log.Fatalf("Could not run server: %v", err)
	}
}
