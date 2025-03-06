package models

type UpdateScoreBody struct {
	Result string `json:"result" binding:"required"`
	Token  string `json:"token" binding:"required"`
}

type Users struct {
	Users []User `json:"users"`
	Total int    `json:"total"`
}

type GetUsersBody struct {
	Offset int `json:"offset"`
}
