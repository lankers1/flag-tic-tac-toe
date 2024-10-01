package db

import (
	"github.com/jackc/pgx/v5/pgxpool"
	"context"
	"log"
)

func Connect(databaseUrl string) *pgxpool.Pool {
	conn, error := pgxpool.New(context.Background(), databaseUrl)
	
	if error != nil {
		log.Fatalf("Unable to connect to database: %v\n", error)
	}
	
	return conn
}
