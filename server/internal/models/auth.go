package models

type Registration struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Email string `json:"email"`
}

type User struct {
	Username string `json:"username"`
	Rank int `json:"rank"`
	FavouriteFlag string `json:"favouriteFlag"`
  Token string `json:"token"`
}

type UserWithPassword struct {
	Username string `json:"username"`
	Rank int `json:"rank"`
	FavouriteFlag string `json:"favouriteFlag"`
	Password []byte `json:"password"`
  Token string `json:"token"`
}


type Login struct {
	Username string `json:"username"`
	Password string `json:"password"`
}
