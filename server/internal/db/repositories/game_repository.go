package repositories

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/lankers1/fttt/internal/models"
	"github.com/lankers1/fttt/internal/validators"
)

type GameRepository struct {
	conn *pgxpool.Pool
	ctx  context.Context
}

func NewGameRepository(conn *pgxpool.Pool, ctx context.Context) *GameRepository {
	return &GameRepository{
		conn: conn,
		ctx:  ctx,
	}
}

func generateGame(conn *pgxpool.Pool, ctx context.Context) (*models.Game, *validators.AppError) {
	query := `SELECT 
		first_row_id,
		first_row,
		first_column_id,
		first_column,
		second_row_id,
		second_row,
		second_column_id,
		second_column,
		third_row_id,
		third_row,
		third_column_id,
		third_column
	FROM generate_game`
	rows, queryErr := conn.Query(ctx, query)

	if queryErr != nil {
		fmt.Println("Something went wrong when generating game: ", queryErr)
		return nil, &validators.AppError{
			Code:    http.StatusInternalServerError,
			Message: "Something went wrong when generating game",
		}
	}
	defer rows.Close()

	game, err := pgx.CollectOneRow(rows, pgx.RowToStructByPos[models.Game])

	if err != nil {
		log.Printf("CollectRows error: %v", err)
		return generateGame(conn, ctx)
	}

	return &game, nil
}

func (gameRepo *GameRepository) Create() (*models.Game, *validators.AppError) {
	game, err := generateGame(gameRepo.conn, gameRepo.ctx)

	if err != nil {
		return nil, err
	}

	return game, nil
}

func (gameRepo *GameRepository) GetAnswers(game *models.Game) (*models.Answer, *validators.AppError) {
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

	rows, queryErr := gameRepo.conn.Query(gameRepo.ctx, query,
		"{"+strconv.Itoa(game.FirstColumnId)+","+strconv.Itoa(game.FirstRowId)+"}",
		"{"+strconv.Itoa(game.FirstColumnId)+","+strconv.Itoa(game.SecondRowId)+"}",
		"{"+strconv.Itoa(game.FirstColumnId)+","+strconv.Itoa(game.ThirdRowId)+"}",
		"{"+strconv.Itoa(game.SecondColumnId)+","+strconv.Itoa(game.FirstRowId)+"}",
		"{"+strconv.Itoa(game.SecondColumnId)+","+strconv.Itoa(game.SecondRowId)+"}",
		"{"+strconv.Itoa(game.SecondColumnId)+","+strconv.Itoa(game.ThirdRowId)+"}",
		"{"+strconv.Itoa(game.ThirdColumnId)+","+strconv.Itoa(game.FirstRowId)+"}",
		"{"+strconv.Itoa(game.ThirdColumnId)+","+strconv.Itoa(game.SecondRowId)+"}",
		"{"+strconv.Itoa(game.ThirdColumnId)+","+strconv.Itoa(game.ThirdRowId)+"}",
	)

	if queryErr != nil {
		return nil, &validators.AppError{
			Code:    http.StatusInternalServerError,
			Message: "Something went wrong when getting game answers",
		}
	}

	defer func() {
		rows.Close()
	}()

	answers, err := pgx.CollectOneRow(rows, pgx.RowToStructByPos[models.Answer])

	if err != nil {
		return nil, &validators.AppError{
			Code:    http.StatusInternalServerError,
			Message: "Something went wrong when getting game answers",
		}
	}

	return &answers, nil
}

func (gameRepo *GameRepository) OnlineGame(game *models.Game, players []string) (*models.OnlineGame, *validators.AppError) {
	onlineGame, err := generateOnlineGame(gameRepo.conn, gameRepo.ctx, game, players)

	if err != nil {
		return nil, err
	}

	return onlineGame, nil
}

func (gameRepo *GameRepository) GetOnlineGame(gameId string) (*models.OnlineGameBoard, *validators.AppError) {
	query := "SELECT board, player_one_id, player_two_id, completed FROM game WHERE game_id = $1"

	i, err := strconv.Atoi(gameId)

	if err != nil {
		return nil, &validators.AppError{
			Code:    http.StatusInternalServerError,
			Message: "Something went wrong when getting online game",
		}
	}

	rows, queryErr := gameRepo.conn.Query(gameRepo.ctx, query, i)

	if queryErr != nil {
		return nil, &validators.AppError{
			Code:    http.StatusInternalServerError,
			Message: "Something went wrong when getting online game",
		}
	}

	defer rows.Close()

	res, err := pgx.CollectOneRow(rows, pgx.RowToStructByPos[models.OnlineGameBoard])

	if err != nil {
		return nil, &validators.AppError{
			Code:    http.StatusInternalServerError,
			Message: "Something went wrong when getting online game",
		}
	}

	return &res, nil
}

func generateOnlineGame(conn *pgxpool.Pool, ctx context.Context, game *models.Game, players []string) (*models.OnlineGame, *validators.AppError) {
	query := "INSERT INTO game(game_id, player_one_id, player_two_id, time_played, board) VALUES(floor(random() * 100000000 + 1)::int, $2, $3, current_timestamp, $1) RETURNING game_id"
	rows, queryErr := conn.Query(ctx, query, game, players[0], players[1])

	if queryErr != nil {
		return nil, &validators.AppError{
			Code:    http.StatusInternalServerError,
			Message: "Something went wrong when generating online game",
		}
	}

	defer func() {
		rows.Close()
	}()

	res, err := pgx.CollectOneRow(rows, pgx.RowToStructByPos[models.OnlineGame])

	if err != nil {
		return nil, &validators.AppError{
			Code:    http.StatusInternalServerError,
			Message: "Something went wrong when generating online game",
		}
	}

	return &res, nil
}

func (gameRepo *GameRepository) UpdateWinner(gameId string, username string) *validators.AppError {
	query := "UPDATE game SET winner = $1, completed = true WHERE game_id = $2 AND completed = false;"
	rows, queryErr := gameRepo.conn.Query(gameRepo.ctx, query, username, gameId)

	if queryErr != nil {
		return &validators.AppError{
			Code:    http.StatusInternalServerError,
			Message: "Something went wrong updating the winner",
		}
	}

	defer rows.Close()

	return nil
}
