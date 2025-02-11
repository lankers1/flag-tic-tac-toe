package models

type Login struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type Register struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	Email    string `json:"email" binding:"required"`
}

type User struct {
	Username      string `json:"username"`
	Rank          int    `json:"rank"`
	FavouriteFlag string `json:"favouriteFlag"`
}

type UserLogin struct {
	Username      string `json:"username"`
	Rank          int    `json:"rank"`
	FavouriteFlag string `json:"favouriteFlag"`
	Token         string `json:"token"`
}

type UserWithPassword struct {
	Username      string `json:"username"`
	Rank          int    `json:"rank"`
	FavouriteFlag string `json:"favouriteFlag"`
	Password      []byte `json:"password"`
	Token         string `json:"token"`
}
