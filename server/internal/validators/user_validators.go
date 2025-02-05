package validators

import (
	"github.com/lankers1/fttt/internal/models"
)

type AppError struct {
	Code     int    `json:"code"`
	Message  string `json:"message"`
}

func RegisterValidators(body models.Registration) ([]AppError) {
	errors := []AppError{}
	LengthValidator(errors, body.Username, 3, 16)
	

	return errors
}
