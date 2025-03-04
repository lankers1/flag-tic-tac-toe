package repositories

import (
	"context"
	"net/http"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/lankers1/fttt/internal/models"
	"github.com/lankers1/fttt/internal/validators"
)

type FlagRepository struct {
	conn *pgxpool.Pool
	ctx  context.Context
}

func NewFlagRepository(conn *pgxpool.Pool, ctx context.Context) *FlagRepository {
	return &FlagRepository{
		conn: conn,
		ctx:  ctx,
	}
}

func (flagRepo *FlagRepository) SearchFlags(searchTerm string) (*[]models.Flag, *validators.AppError) {
	query := "SELECT iso_2, name FROM flags WHERE name ILIKE $1;"
	rows, queryErr := flagRepo.conn.Query(flagRepo.ctx, query, "%"+searchTerm+"%")

	if queryErr != nil {
		return nil, &validators.AppError{
			Code:    http.StatusInternalServerError,
			Message: "Something went wrong when searching for flags",
		}
	}

	defer rows.Close()

	flags, err := pgx.CollectRows(rows, pgx.RowToStructByPos[models.Flag])

	if err != nil {
		return nil, &validators.AppError{
			Code:    http.StatusInternalServerError,
			Message: "Something went wrong when searching for flags",
		}
	}

	return &flags, nil
}
