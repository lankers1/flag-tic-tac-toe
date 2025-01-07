package repositories

import (
	"log"
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5"
	"github.com/lankers1/fttt/internal/models"
)

type AuthInterface interface {
	Register(*models.Registration) error
}

type AuthRepository struct {
	conn *pgxpool.Pool
}

func NewAuthRepository(conn *pgxpool.Pool) *AuthRepository {
	return &AuthRepository{
		conn: conn,
	}
}

func (authRepo *AuthRepository) Register(body models.Registration) *models.User {
	query := "INSERT INTO users(username, password, rank, email, favourite_flag) VALUES($1, $2, 1000, $3, $4) RETURNING username, rank, favourite_flag"

	rows, queryErr := authRepo.conn.Query(context.Background(), query, body.Username, body.Password, body.Email, body.FavouriteFlag)

	if queryErr != nil {
		log.Printf("Query error: %v", queryErr)
	 }

	 res, err := pgx.CollectOneRow(rows, pgx.RowToStructByPos[models.User])
	
	if err != nil {
		log.Printf("CollectRows error: %v", err)
	}

	return &res
}
