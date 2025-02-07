package validators

import (
	"github.com/lankers1/fttt/internal/models"
)

func AuthValidators(body models.Auth) []string {
	errors := []string{}

	existsValidator(&errors, body.Username)
	lengthValidator(&errors, body.Username, 3, 16)
	characterValidator(&errors, body.Username)
	existsValidator(&errors, body.Password)
	lengthValidator(&errors, body.Password, 6, 16)
	characterValidator(&errors, body.Password)

	return errors
}
