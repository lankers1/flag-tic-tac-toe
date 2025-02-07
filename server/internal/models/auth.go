package models

type Auth struct {
	Username string `json:"username"`
	Password string `json:"password"`
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
