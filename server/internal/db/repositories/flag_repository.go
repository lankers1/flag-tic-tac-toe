package repositories

import (
	"context"
	"fmt"
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

func (flagRepo *FlagRepository) SearchFlagCharacteristics(searchTerm string, characteristics []string) (*[]models.FlagCharacteristics, *validators.AppError) {
	query := `
	SELECT iso_2,
name,
characteristics
FROM (
    SELECT f.iso_2,
      f.name,
	  jsonb_agg(jsonb_build_object('name', c.name, 'type', c.type)) as characteristics
    FROM flags f
      JOIN flag_characteristics fc ON f.iso_2 = fc.flag_id
      JOIN characteristics c ON fc.characteristic_id = c.characteristic_id
    GROUP BY f.iso_2, f.name
  ) characteristics_by_flag_iso
	 WHERE $1 <@ ARRAY(SELECT jsonb_array_elements_text(jsonb_path_query_array(
    characteristics,
    '$.name'
  )))
		AND name ILIKE $2
  ORDER BY name
	;`
	rows, queryErr := flagRepo.conn.Query(flagRepo.ctx, query, characteristics, "%"+searchTerm+"%")

	if queryErr != nil {
		fmt.Println(queryErr)
		return nil, &validators.AppError{
			Code:    http.StatusInternalServerError,
			Message: "Something went wrong when searching for flags",
		}
	}

	defer rows.Close()

	flags, err := pgx.CollectRows(rows, pgx.RowToStructByPos[models.FlagCharacteristics])

	if err != nil {
		return nil, &validators.AppError{
			Code:    http.StatusInternalServerError,
			Message: "Something went wrong when searching for flags",
		}
	}

	return &flags, nil
}

func (flagRepo *FlagRepository) Characteristics() (*[]models.Characteristics, *validators.AppError) {
	query := "SELECT characteristic_id, name, type FROM characteristics ORDER BY type;"
	rows, queryErr := flagRepo.conn.Query(flagRepo.ctx, query)

	if queryErr != nil {
		fmt.Println(queryErr)
		return nil, &validators.AppError{
			Code:    http.StatusInternalServerError,
			Message: "Something went wrong when selecting flag characteristics",
		}
	}

	defer rows.Close()

	flags, err := pgx.CollectRows(rows, pgx.RowToStructByPos[models.Characteristics])

	if err != nil {
		return nil, &validators.AppError{
			Code:    http.StatusInternalServerError,
			Message: "Something went wrong when selecting flag characteristics",
		}
	}

	return &flags, nil
}
