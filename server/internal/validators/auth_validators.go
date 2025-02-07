package validators

import (
	"github.com/lankers1/fttt/internal/models"
)

func RegisterValidators(body models.Register) []string {
	errors := []string{}

	existsValidator(&errors, "Username", body.Username)
	lengthValidator(&errors, "Username", body.Username, 3, 16)
	characterValidator(&errors, "Username", body.Username)
	existsValidator(&errors, "Password", body.Password)
	lengthValidator(&errors, "Password", body.Password, 6, 16)
	characterValidator(&errors, "Password", body.Password)
	existsValidator(&errors, "Email", body.Email)

	return errors
}

func LoginValidators(body models.Login) []string {
	errors := []string{}

	existsValidator(&errors, "Username", body.Username)
	lengthValidator(&errors, "Username", body.Username, 3, 16)
	characterValidator(&errors, "Username", body.Username)
	existsValidator(&errors, "Password", body.Password)
	lengthValidator(&errors, "Password", body.Password, 6, 16)
	characterValidator(&errors, "Password", body.Password)

	return errors
}
