package repositories

import (
	"context"
	"errors"
	"log"
	"net/http"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/lankers1/fttt/internal/models"
	"github.com/lankers1/fttt/internal/validators"
	"golang.org/x/crypto/bcrypt"
)

type AuthRepository struct {
	conn *pgxpool.Pool
	ctx  context.Context
}

func NewAuthRepository(conn *pgxpool.Pool, ctx context.Context) *AuthRepository {
	return &AuthRepository{
		conn: conn,
		ctx:  ctx,
	}
}

func (authRepo *AuthRepository) Register(body models.Register) (*models.UserLogin, *validators.AppError) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	user := models.UserLogin{}

	if err != nil {
		return nil, &validators.AppError{
			Code:    http.StatusInternalServerError,
			Message: "Something went wrong",
		}
	}

	validationErr := validators.RegisterValidators(body)

	if len(validationErr) > 0 {
		return nil, &validators.AppError{
			Code:    http.StatusUnprocessableEntity,
			Message: "Incorrect data for fields",
			Details: validationErr,
		}
	}

	query := "INSERT INTO users(username, password, rank, email, favourite_flag, token) VALUES($1, $2, 1000, $3, (SELECT iso_2 FROM flags ORDER BY random() limit 1), gen_random_uuid()) RETURNING username, rank, favourite_flag, token"

	queryErr := authRepo.conn.QueryRow(authRepo.ctx, query, body.Username, hashedPassword, body.Email).Scan(&user.Username, &user.Rank, &user.FavouriteFlag, &user.Token)

	if queryErr != nil {
		var pgErr *pgconn.PgError
		if errors.As(queryErr, &pgErr) {
			if pgErr.Message == "duplicate key value violates unique constraint \"username_unq\"" {
				return nil, &validators.AppError{
					Code:    http.StatusConflict,
					Message: "Username already taken, try a different username",
				}
			}
		}

		return nil, &validators.AppError{
			Code:    http.StatusInternalServerError,
			Message: "Something went wrong",
		}
	}

	return &user, nil
}

func (authRepo *AuthRepository) Login(body models.Login) (*models.UserLogin, *validators.AppError) {
	validationErr := validators.LoginValidators(body)

	if len(validationErr) > 0 {
		return nil, &validators.AppError{
			Code:    http.StatusUnprocessableEntity,
			Message: "Incorrect data for fields",
			Details: validationErr,
		}
	}

	query := "SELECT username, rank, favourite_flag, password, token FROM users WHERE username = $1;"
	rows, queryErr := authRepo.conn.Query(authRepo.ctx, query, body.Username)
	res, err := pgx.CollectOneRow(rows, pgx.RowToStructByPos[models.UserWithPassword])

	if err != nil || queryErr != nil {
		return nil, &validators.AppError{
			Code:    http.StatusInternalServerError,
			Message: "Something went wrong",
		}
	}

	defer rows.Close()

	passwordComparisonErr := bcrypt.CompareHashAndPassword(res.Password, []byte(body.Password))

	if passwordComparisonErr != nil {
		log.Printf("Incorrect details: %v", passwordComparisonErr)
		return nil, &validators.AppError{
			Code:    http.StatusUnauthorized,
			Message: "Incorrect credentials, please try again",
		}
	}

	response := models.UserLogin{Username: res.Username, Token: res.Token, Rank: res.Rank, FavouriteFlag: res.FavouriteFlag}

	return &response, nil
}
