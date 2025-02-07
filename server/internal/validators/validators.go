package validators

import (
	"regexp"
)

type AppError struct {
	Code     int      `json:"code"`
	Messages []string `json:"message"`
}

func lengthValidator(errors *[]string, value string, min, max int) {
	if (len(value) <= min || len(value) > max) && value != "" {
		*errors = append(*errors,
			"Username is too short, needs to be between 3 and 16 characters",
		)
	}
}

func existsValidator(errors *[]string, value any) {
	if value == "" {
		*errors = append(*errors,
			"Username is required",
		)
	}
}

func characterValidator(errors *[]string, value string) {
	match, _ := regexp.MatchString("^[^-\\s][a-zA-Z0-9]+$", value)

	if match == false {
		*errors = append(*errors, "Username can only contain letters or numbers")
	}
}
