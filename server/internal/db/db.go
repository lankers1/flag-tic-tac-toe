package db

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

func Connect(databaseUrl string, ctx context.Context) *pgxpool.Pool {
	conn, error := pgxpool.New(ctx, databaseUrl)

	if error != nil {
		log.Fatalf("Unable to connect to database: %v\n", error)
	}

	return conn
}
