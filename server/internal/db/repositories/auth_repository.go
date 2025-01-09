package repositories

import (
	"log"
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5"
	"github.com/lankers1/fttt/internal/models"
	"golang.org/x/crypto/bcrypt"
)

type AuthInterface interface {
	Register(*models.Registration) error
	Login(*models.Login) error
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
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	if err != nil {
			panic(err)
	}

	query := "INSERT INTO users(username, password, rank, email, favourite_flag, token) VALUES($1, $2, 1000, $3, (SELECT iso_2 FROM flags ORDER BY random() limit 1), gen_random_uuid()) RETURNING username, rank, favourite_flag, token"

	rows, queryErr := authRepo.conn.Query(context.Background(), query, body.Username, hashedPassword, body.Email)

	if queryErr != nil {
		log.Printf("Query error: %v", queryErr)
	 }

	 res, err := pgx.CollectOneRow(rows, pgx.RowToStructByPos[models.User])
	
	if err != nil {
		log.Printf("CollectRows error: %v", err)
		panic(err)
	}

	return &res
}

func (authRepo *AuthRepository) Login(body models.Login) *models.User {
	query := "SELECT username, rank, favourite_flag, password, token FROM users;"

	rows, queryErr := authRepo.conn.Query(context.Background(), query)

	if queryErr != nil {
		log.Printf("Query error: %v", queryErr)
	 }

	 res, err := pgx.CollectOneRow(rows, pgx.RowToStructByPos[models.UserWithPassword])

	 if err != nil {
		log.Printf("CollectRows error: %v", err)
		panic(err)
	}

	 passwordComparisonErr := bcrypt.CompareHashAndPassword(res.Password, []byte(body.Password))

	 if passwordComparisonErr !=nil {
		log.Printf("Incorrect details: %v", err)
		panic(err)
	 }
	 
	response := models.User{Username: res.Username, Token: res.Token, Rank: res.Rank, FavouriteFlag: res.FavouriteFlag}

	return &response
}
