package repositories

import (
	"log"
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5"
	"github.com/lankers1/fttt/internal/models"
)

type UserInterface interface {
	GetUser(username string) error
}

type UserRepository struct {
	conn *pgxpool.Pool
}

func NewUserRepository(conn *pgxpool.Pool) *UserRepository {
	return &UserRepository{
		conn: conn,
	}
}

func (userRepo *UserRepository) GetUser(username string) *models.User {
	query := "SELECT username, rank, favourite_flag, token FROM users WHERE username = $1"
	rows, queryErr := userRepo.conn.Query(context.Background(), query, username)

	if queryErr != nil {
		log.Printf("Query error: %v", queryErr)
	 }

	user, err := pgx.CollectOneRow(rows, pgx.RowToStructByPos[models.User])

	if err != nil {
		log.Printf("CollectRows error: %v", err)
	}

	 return &user
}
