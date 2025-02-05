package validators


func LengthValidator(errors []AppError, value string, min, max int) []AppError {
	if len(value) <= min || len(value) > max {
		return append(errors, AppError{ 
			Message: "Username is too short, needs to be between 3 and 16 characters",
		})
	}

	return errors
}
