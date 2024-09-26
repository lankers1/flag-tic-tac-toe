package db

import (
	"github.com/jackc/pgx/v5"
	"context"
	"log"
)

func Connect(databaseUrl string) *pgx.Conn {
	conn, error := pgx.Connect(context.Background(), databaseUrl)
	
	if error != nil {
		log.Fatalf("Unable to connect to database: %v\n", error)
	}
	
	return conn
}
