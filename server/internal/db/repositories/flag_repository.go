package repositories

import (
	"fmt"
	"log"
	"context"
	"github.com/jackc/pgx/v5"
	"fttt/internal/models"
)

type FlagInterface interface {
	Create(*models.Flag) error
}

type FlagRepository struct {
	conn *pgx.Conn
}

func NewFlagRepository(conn *pgx.Conn) *FlagRepository {
	return &FlagRepository{
		conn: conn,
	}
}

func (flagRepo *FlagRepository) SearchFlags(searchTerm string) *[]models.Flag {
	fmt.Println(searchTerm)
	query := "SELECT iso_2, name FROM flags WHERE name LIKE $1;"
	rows, queryErr := flagRepo.conn.Query(context.Background(), query, "%" + searchTerm + "%")

	if queryErr != nil {
		log.Printf("Query error: %v", queryErr)
	 }

	flags, err := pgx.CollectRows(rows, pgx.RowToStructByPos[models.Flag])
	
	fmt.Println(flags)
	if err != nil {
		log.Printf("CollectRows error: %v", err)
	}

	return &flags
}
