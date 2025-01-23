package repositories

import (
	"net/http"
	"log"
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5"
	"github.com/lankers1/fttt/internal/models"
)

type UserRepository struct {
	conn *pgxpool.Pool
}

func NewUserRepository(conn *pgxpool.Pool) *UserRepository {
	return &UserRepository{
		conn: conn,
	}
}

func (userRepo *UserRepository) GetUser(username string) *models.User {
	query := "SELECT username, rank, favourite_flag FROM users WHERE username = $1"
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

func (userRepo *UserRepository) UpdateScore(username string, body *models.UpdateScoreBody) (*models.User, *appError) {
	if body.Result == "loss" {
		query := "UPDATE users SET rank = (SELECT rank - 10 FROM users WHERE username = $1) WHERE username = $1 AND token = $2 RETURNING username, rank, favourite_flag"
		rows, queryErr := userRepo.conn.Query(context.Background(), query, username, body.Token)

		if queryErr != nil {
			log.Printf("Query error: %v", queryErr)
		 }
	
		user, err := pgx.CollectOneRow(rows, pgx.RowToStructByPos[models.User])
	
		if (models.User{}) == user {
			return nil, &appError{ 
				Code: http.StatusInternalServerError,
				Message: "You are not authorized to update this user",
			}
		}

		if err != nil {
			log.Printf("CollectRows error: %v", err)
		}
	
		 return &user, nil
	} 

	if body.Result == "win" {
		query := "UPDATE users SET rank = (SELECT rank + 10 FROM users WHERE username = $1) WHERE username = $1 AND token = $2 RETURNING username, rank, favourite_flag"
		rows, queryErr := userRepo.conn.Query(context.Background(), query, username, body.Token)

		if queryErr != nil {
			log.Printf("Query error: %v", queryErr)
		 }
	
		user, err := pgx.CollectOneRow(rows, pgx.RowToStructByPos[models.User])

		if (models.User{}) == user {
			return nil, &appError{ 
				Code: http.StatusInternalServerError,
				Message: "You are not authorized to update this user",
			}
		}

		if err != nil {
			log.Printf("CollectRows error: %v", err)
		}
	
		return &user, nil
	}

	return nil, &appError{ 
		Code: http.StatusInternalServerError,
		Message: "Something went wrong",
	}
}

func (userRepo *UserRepository) GetUsers() ([]models.User, *appError) {
	query := "SELECT username, rank, favourite_flag FROM users ORDER BY rank DESC;"
	rows, queryErr := userRepo.conn.Query(context.Background(), query)

	if queryErr != nil {
		return nil, &appError{ 
			Code: http.StatusInternalServerError,
			Message: "Something went wrong",
		}
	}

	user, err := pgx.CollectRows(rows, pgx.RowToStructByPos[models.User])

	if err != nil {
		return nil, &appError{ 
			Code: http.StatusInternalServerError,
			Message: "Something went wrong",
		}
	}

	return user, nil
}
