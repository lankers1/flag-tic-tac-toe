package repositories

import (
	"fmt"
	"strconv"
	"log"
	"context"
	"github.com/jackc/pgx/v5"
	"fttt/internal/models"
)

type GameInterface interface {
	Create(*models.Game) error
	GetAnswers(*models.Answer) error
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

func (gameRepo *GameRepository) GetAnswers(game *models.Game) *models.Answer {
	fmt.Println(game.FirstColumnId)
	query := `SELECT 
							r1c1,
							r2c1,
							r3c1,
							r1c2,
							r2c2,
							r3c2,
							r1c3,
							r2c3,
							r3c3 
						FROM 
							get_flag_ids_on_char_id($1) AS r1c1, 
							get_flag_ids_on_char_id($2) AS r2c1, 
							get_flag_ids_on_char_id($3) AS r3c1, 
							get_flag_ids_on_char_id($4) AS r1c2, 
							get_flag_ids_on_char_id($5) AS r2c2, 
							get_flag_ids_on_char_id($6) AS r3c2, 
							get_flag_ids_on_char_id($7) AS r1c3, 
							get_flag_ids_on_char_id($8) AS r2c3, 
							get_flag_ids_on_char_id($9) AS r3c3;`

	rows, queryErr := gameRepo.conn.Query(context.Background(),query, 
		"{" + strconv.Itoa(game.FirstColumnId) + "," + strconv.Itoa(game.FirstRowId) + "}",
		"{" + strconv.Itoa(game.FirstColumnId) + "," + strconv.Itoa(game.SecondRowId) + "}", 
		"{" + strconv.Itoa(game.FirstColumnId) + "," + strconv.Itoa(game.ThirdRowId) + "}", 
		"{" + strconv.Itoa(game.SecondColumnId) + "," + strconv.Itoa(game.FirstRowId) + "}",
		"{" + strconv.Itoa(game.SecondColumnId) + "," + strconv.Itoa(game.SecondRowId) + "}", 
		"{" + strconv.Itoa(game.SecondColumnId) + "," + strconv.Itoa(game.ThirdRowId) + "}", 
		"{" + strconv.Itoa(game.ThirdColumnId) + "," + strconv.Itoa(game.FirstRowId) + "}",
		"{" + strconv.Itoa(game.ThirdColumnId) + "," + strconv.Itoa(game.SecondRowId) + "}", 
		"{" + strconv.Itoa(game.ThirdColumnId) + "," + strconv.Itoa(game.ThirdRowId) + "}",
	)

	if queryErr != nil {
		log.Printf("Query error: %v", queryErr)
	 }

	answers, err := pgx.CollectOneRow(rows, pgx.RowToStructByPos[models.Answer])

	if err != nil {
		log.Printf("CollectRows error: %v", err)
	}

	return &answers
}
