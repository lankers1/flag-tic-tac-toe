package validators

import (
	"github.com/lankers1/fttt/internal/models"
)

func RegisterValidators(body models.Register) []string {
	errors := []string{}

	lengthValidator(&errors, "Username", body.Username, 6, 16)
	characterValidator(&errors, "Username", body.Username)
	lengthValidator(&errors, "Password", body.Password, 6, 16)
	characterValidator(&errors, "Password", body.Password)

	return errors
}

func LoginValidators(body models.Login) []string {
	errors := []string{}

	lengthValidator(&errors, "Username", body.Username, 6, 16)
	characterValidator(&errors, "Username", body.Username)
	lengthValidator(&errors, "Password", body.Password, 6, 16)
	characterValidator(&errors, "Password", body.Password)

	return errors
}
