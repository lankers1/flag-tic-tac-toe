package validators

import (
	"regexp"
)

type AppError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

func lengthValidator(errors *[]AppError, value string, min, max int) {
	if (len(value) <= min || len(value) > max) && value != "" {
		*errors = append(*errors, AppError{
			Message: "Username is too short, needs to be between 3 and 16 characters",
		})
	}
}

func existsValidator(errors *[]AppError, value any) {
	if value == "" {
		*errors = append(*errors, AppError{
			Message: "Username is required",
		})
	}
}

func characterValidator(errors *[]AppError, value string) {
	match, _ := regexp.MatchString("[A-Z0-9]", "peach")

	if match {
		*errors = append(*errors, AppError{
			Message: "Username can only contain letters or numbers",
		})
	}
}
