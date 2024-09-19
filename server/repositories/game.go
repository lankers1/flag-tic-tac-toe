package repositories

import (
 "context"
 "github.com/jackc/pgx/v5"
 "fttt/models"
)

type GameRepository struct {
 conn *pgx.Conn
}

func InitGameRepository(connection *pgx.Conn) *GameRepository {
 return &GameRepository{connection}
}

func (r *GameRepository) GetGame() (*models.Game, error) {
 var game models.Game
 err := r.conn.QueryRow(context.Background(), "SELECT * FROM generate_game;").Scan(
	&game.FirstRowId,
	&game.FirstRow,
	&game.FirstColumnId,
	&game.FirstColumn,
	&game.SecondRowId,
	&game.SecondRow,
	&game.SecondColumnId,
	&game.SecondColumn,
	&game.ThirdRowId,
	&game.ThirdRow,
	&game.ThirdColumnId,
	&game.ThirdColumn,
	)
 if err != nil {
  return nil, err
 }

 return &game, nil
}
