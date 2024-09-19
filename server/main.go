package main

import (
	"github.com/gin-gonic/gin"
	cors "github.com/rs/cors/wrapper/gin"
	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
	"fmt"
	"net/http"

	"os"
	"context"
	"log"
)


type Game struct {
	FirstRowId  int  `json:"first_row_id"`
	FirstRow  string  `json:"first_row"`
	FirstColumnId  int  `json:"first_column_id"`
	FirstColumn  string  `json:"first_column"`
	SecondRowId int  `json:"second_row_id"`
	SecondRow  string `json:"second_row"`
	SecondColumnId int  `json:"second_column_id"`
	SecondColumn  string `json:"second_column"`
	ThirdRowId int  `json:"third_row_id"`
	ThirdRow  string `json:"third_row"`
	ThirdColumnId int  `json:"third_column_id"`
	ThirdColumn  string `json:"third_column"`
}

func goDotEnvVariable(key string) string {
  err := godotenv.Load(".env")

  if err != nil {
    fmt.Printf("Error loading .env file")
  }

  return os.Getenv(key)
}

func getGame(ctx *gin.Context,  conn *pgx.Conn) {
	var game Game

	queryErr := conn.QueryRow(context.Background(), "SELECT * FROM generate_game").Scan(
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


		if queryErr != nil {
			log.Fatalf("Error running query: %v", queryErr)
		 }
	

	ctx.JSON(http.StatusOK, game)
}

func main() {
	conn, error := pgx.Connect(context.Background(), goDotEnvVariable("DATABASE_URL"))
	if error != nil {
		log.Fatalf("Unable to connect to database: %v\n", error)
	}

	defer conn.Close(context.Background())

	r := gin.Default()

	


	r.Use(cors.Default())

	r.GET("/game", func(ctx *gin.Context) {
		getGame(ctx, conn)
  })

	rErr := r.Run()

	if rErr != nil {
	 log.Fatalf("Could not run server: %v", rErr)
	}
}
