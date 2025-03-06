package repositories

import (
	"context"
	"log"
	"net/http"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/lankers1/fttt/internal/models"
	"github.com/lankers1/fttt/internal/validators"
)

type UserRepository struct {
	conn *pgxpool.Pool
	ctx  context.Context
}

func NewUserRepository(conn *pgxpool.Pool, ctx context.Context) *UserRepository {
	return &UserRepository{
		conn: conn,
		ctx:  ctx,
	}
}

func (userRepo *UserRepository) GetUser(username string) *models.User {
	query := "SELECT username, rank, favourite_flag FROM users WHERE username = $1"
	rows, queryErr := userRepo.conn.Query(userRepo.ctx, query, username)

	if queryErr != nil {
		log.Printf("Query error: %v", queryErr)
	}

	defer rows.Close()

	user, err := pgx.CollectOneRow(rows, pgx.RowToStructByPos[models.User])

	if err != nil {
		log.Printf("CollectRows error: %v", err)
	}

	return &user
}

func (userRepo *UserRepository) UpdateScore(username string, body *models.UpdateScoreBody) (*models.User, *validators.AppError) {
	if body.Result == "loss" {
		query := "UPDATE users SET rank = (SELECT rank - 10 FROM users WHERE username = $1) WHERE username = $1 AND token = $2 RETURNING username, rank, favourite_flag"
		rows, queryErr := userRepo.conn.Query(userRepo.ctx, query, username, body.Token)

		if queryErr != nil {
			log.Printf("Query error: %v", queryErr)
		}

		defer rows.Close()

		user, err := pgx.CollectOneRow(rows, pgx.RowToStructByPos[models.User])

		if (models.User{}) == user {
			return nil, &validators.AppError{
				Code:    http.StatusInternalServerError,
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
		rows, queryErr := userRepo.conn.Query(userRepo.ctx, query, username, body.Token)

		if queryErr != nil {
			log.Printf("Query error: %v", queryErr)
		}

		defer rows.Close()

		user, err := pgx.CollectOneRow(rows, pgx.RowToStructByPos[models.User])

		if (models.User{}) == user {
			return nil, &validators.AppError{
				Code:    http.StatusInternalServerError,
				Message: "You are not authorized to update this user",
			}
		}

		if err != nil {
			log.Printf("CollectRows error: %v", err)
		}

		return &user, nil
	}

	return nil, &validators.AppError{
		Code:    http.StatusInternalServerError,
		Message: "Something went wrong",
	}
}

func (userRepo *UserRepository) GetUsers(offset int) (models.Users, *validators.AppError) {
	query := `WITH filtered_data AS (
				SELECT 
				username,
				rank, 
				favourite_flag
				FROM users
			ORDER BY rank DESC
				OFFSET $1
				LIMIT 10
		), 
		total_count AS (
				SELECT COUNT(username) AS total_rows
				FROM users
		)
		SELECT 
				JSONB_AGG(JSONB_BUILD_OBJECT(
						'username', username, 
						'rank', rank, 
						'favouriteFlag', favourite_flag
				)) as data,
				(SELECT total_rows FROM total_count) as total
		FROM filtered_data;`
	rows, queryErr := userRepo.conn.Query(userRepo.ctx, query, offset)

	if queryErr != nil {
		return models.Users{}, &validators.AppError{
			Code:    http.StatusInternalServerError,
			Message: "Something went wrong",
		}
	}

	defer rows.Close()

	user, err := pgx.CollectOneRow(rows, pgx.RowToStructByPos[models.Users])

	if err != nil {
		return models.Users{}, &validators.AppError{
			Code:    http.StatusInternalServerError,
			Message: "Something went wrong",
		}
	}

	return user, nil
}
