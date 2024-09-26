package repositories

import (
	"log"
	"context"
	"github.com/jackc/pgx/v5"
	"fttt/internal/models"
)

type GameInterface interface {
	Create(*models.Game) error
}

type GameRepository struct {
	conn *pgx.Conn
}

func NewGameRepository(conn *pgx.Conn) *GameRepository {
	return &GameRepository{
		conn: conn,
	}
}

func (gameRepo *GameRepository) Create() *models.Game {
	query := "SELECT * FROM generate_game"
	rows, queryErr := gameRepo.conn.Query(context.Background(),query)

	if queryErr != nil {
		log.Printf("Query error: %v", queryErr)
	 }

	game, err := pgx.CollectOneRow(rows, pgx.RowToStructByPos[models.Game])

	if err != nil {
		log.Printf("CollectRows error: %v", err)
	}

	return &game
}
