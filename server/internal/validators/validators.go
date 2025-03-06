package validators

import (
	"regexp"
)

type AppError struct {
	Code    int      `json:"code"`
	Message string   `json:"message"`
	Details []string `json:"details"`
}

func lengthValidator(errors *[]string, key, value string, min, max int) {
	if (len(value) < min || len(value) > max) && value != "" {
		*errors = append(*errors,
			key+" is too short, needs to be between 6 and 16 characters",
		)
	}
}

func characterValidator(errors *[]string, key, value string) {
	match, _ := regexp.MatchString("^[^-\\s][a-zA-Z0-9]+$", value)

	if match == false {
		*errors = append(*errors, key+" can only contain letters or numbers")
	}
}

func emailValidator(errors *[]string, key, value string) {

	match, _ := regexp.MatchString("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", value)

	if match == false {
		*errors = append(*errors, key+" can only contain letters or numbers")
	}
}
