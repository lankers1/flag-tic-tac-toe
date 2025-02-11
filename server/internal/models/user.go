package models

type UpdateScoreBody struct {
	Result string `json:"result" binding:"required"`
	Token  string `json:"token" binding:"required"`
}
