package main

import (
	"github.com/lankers1/fttt/internal/config"
	"github.com/lankers1/fttt/internal/db"
	"github.com/lankers1/fttt/internal/api"
	"log"
)

func main() {
	cfg := config.InitConfig()

	conn := db.Connect(cfg.DatabaseUrl)

	defer conn.Close()

	handlers := config.InitHandlers(config.InitRepositories(conn))

	api := api.InitApi(handlers)

	err := api.Run()

	if err != nil {
	 log.Fatalf("Could not run server: %v", err)
	}
}
