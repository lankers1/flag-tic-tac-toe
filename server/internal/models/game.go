package models

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

type Answer struct {
	R1c1 []string `json:"r1c1"`  
	R2c1 []string `json:"r2c1"` 
	R3c1 []string `json:"r3c1"` 
	R1c2 []string `json:"r1c2"` 
	R2c2 []string `json:"r2c2"` 
	R3c2 []string `json:"r3c2"` 
	R1c3 []string `json:"r1c3"` 
	R2c3 []string `json:"r2c3"` 
	R3c3 []string `json:"r3c3"`
}

type OnlineGame struct {
	GameId int `json:"gameId"`  
}

type OnlineGameBoard struct {
	Board *Game `json:"board"`  
	PlayerOneId string `json:"playerOneId"`  
	PlayerTwoId string `json:"playerTwoId"`  
	Completed bool `json:"completed"`
}
