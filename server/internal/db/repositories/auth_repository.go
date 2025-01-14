package repositories

import (
	"log"
	"fmt"
	"context"
	"errors"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5"
	"github.com/lankers1/fttt/internal/models"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)



type AuthInterface interface {
	Register(*models.Registration) error
	Login(*models.Login) error
}

type AuthRepository struct {
	conn *pgxpool.Pool
}

type appError struct {
	Code     int    `json:"code"`
	Message  string `json:"message"`
}

func NewAuthRepository(conn *pgxpool.Pool) *AuthRepository {
	return &AuthRepository{
		conn: conn,
	}
}

func (authRepo *AuthRepository) Register(body models.Registration) (*models.User, *appError) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	user := models.User{}

	if err != nil {
		panic(err)
	}

	query := "INSERT INTO users(username, password, rank, email, favourite_flag, token) VALUES($1, $2, 1000, $3, (SELECT iso_2 FROM flags ORDER BY random() limit 1), gen_random_uuid()) RETURNING username, rank, favourite_flag, token"

	queryErr := authRepo.conn.QueryRow(context.Background(), query, body.Username, hashedPassword, body.Email).Scan(&user.Username, &user.Rank, &user.FavouriteFlag, &user.Token)
	if queryErr != nil {
		var pgErr *pgconn.PgError

		if errors.As(queryErr, &pgErr) {
			fmt.Println(pgErr.Message)
			if pgErr.Message == "new row for relation \"users\" violates check constraint \"username_length\"" {
				return nil, &appError{ 
					Code: http.StatusBadRequest,
					Message: "Username is too short, needs to be between 3 and 16 characters",
				}
			}

			if pgErr.Message == "duplicate key value violates unique constraint \"username_unq\"" {
				return nil, &appError{ 
					Code: http.StatusBadRequest,
					Message: "Username already taken, try a different username",
				}
			}
		}
	 }
	
	if err != nil {
		log.Printf("CollectRows error: %v", err)
		panic(err)
	}

	return &user, nil
}

func (authRepo *AuthRepository) Login(body models.Login) (*models.User, *appError) {
	query := "SELECT username, rank, favourite_flag, password, token FROM users WHERE username = $1;"

	rows, queryErr := authRepo.conn.Query(context.Background(), query, body.Username)

	if queryErr != nil {
		log.Printf("Query error: %v", queryErr)
		return nil, &appError{ 
			Code: http.StatusInsufficientStorage,
			Message: "random error",
		}
	 }

	 res, err := pgx.CollectOneRow(rows, pgx.RowToStructByPos[models.UserWithPassword])

	 if err != nil {
		log.Printf("CollectRows error: %v", err)
		return nil, &appError{ 
			Code: http.StatusInsufficientStorage,
			Message: "random error",
		}
	}

	 passwordComparisonErr := bcrypt.CompareHashAndPassword(res.Password, []byte(body.Password))

	 if passwordComparisonErr !=nil {
		log.Printf("Incorrect details: %v", passwordComparisonErr)
		return nil, &appError{ 
			Code: http.StatusInsufficientStorage,
			Message: "random error",
		}
	 }
	 
	response := models.User{Username: res.Username, Token: res.Token, Rank: res.Rank, FavouriteFlag: res.FavouriteFlag}

	return &response, nil
}
