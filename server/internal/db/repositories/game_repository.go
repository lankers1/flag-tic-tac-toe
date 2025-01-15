package repositories

import (
	"net/http"
	"strconv"
	"log"
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5"
	"github.com/lankers1/fttt/internal/models"
)

type GameInterface interface {
	Create(*models.Game) error
	GetAnswers(*models.Answer) error
	OnlineGame(*models.OnlineGame) error
}

type GameRepository struct {
	conn *pgxpool.Pool
}

func NewGameRepository(conn *pgxpool.Pool) *GameRepository {
	return &GameRepository{
		conn: conn,
	}
}

func generateGame(conn *pgxpool.Pool) *models.Game {
	query := "SELECT * FROM generate_game"
	rows, queryErr := conn.Query(context.Background(), query)

	if queryErr != nil {
		log.Printf("Query error: %v", queryErr)
	 }

	game, err := pgx.CollectOneRow(rows, pgx.RowToStructByPos[models.Game])

	if err != nil {
		log.Printf("CollectRows error: %v", err)
		return generateGame(conn)
	}

	 return &game
}

func (gameRepo *GameRepository) Create() *models.Game {
	game := generateGame(gameRepo.conn)

	return game
}

func (gameRepo *GameRepository) GetAnswers(game *models.Game) *models.Answer {
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

func (gameRepo *GameRepository) OnlineGame(game *models.Game, players []string) *models.OnlineGame {
	onlineGame := generateOnlineGame(gameRepo.conn, game, players)

	return onlineGame
}

func (gameRepo *GameRepository) GetOnlineGame(gameId string) *models.OnlineGameBoard {
	query := "SELECT board, player_one_id, player_two_id, completed FROM game WHERE game_id = $1"

	i, err := strconv.Atoi(gameId)
	if err != nil {
			// ... handle error
			panic(err)
	}

	rows, queryErr := gameRepo.conn.Query(context.Background(), query, i)

	if queryErr != nil {
		log.Printf("Query error: %v", queryErr)
	 }

	res, err := pgx.CollectOneRow(rows, pgx.RowToStructByPos[models.OnlineGameBoard])

	if err != nil {
		log.Printf("CollectRows error: %v", err)
	}

	 return &res
}

func generateOnlineGame(conn *pgxpool.Pool, game *models.Game, players []string) *models.OnlineGame {	
	query := "INSERT INTO game(game_id, player_one_id, player_two_id, time_played, board) VALUES(floor(random() * 100000000 + 1)::int, $2, $3, current_timestamp, $1) RETURNING game_id"
	rows, queryErr := conn.Query(context.Background(), query, game, players[0], players[1])

	if queryErr != nil {
		log.Printf("Query error: %v", queryErr)
	 }

	res, err := pgx.CollectOneRow(rows, pgx.RowToStructByPos[models.OnlineGame])

	if err != nil {
		log.Printf("CollectRows error: %v", err)
	}

	 return &res
}

func (gameRepo *GameRepository) UpdateWinner(gameId string, username string) *appError {
	query := "UPDATE game SET winner = $1, completed = true WHERE game_id = $2 AND completed = false;"
	_, queryErr := gameRepo.conn.Query(context.Background(), query, username, gameId)

	if queryErr != nil {
		return &appError{ 
			Code: http.StatusInternalServerError,
			Message: "Something went wrong updating the winner",
		}
	}

	return nil
}
