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
