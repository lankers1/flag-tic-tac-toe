package validators

func SearchFlagsValidators(searchTerm string) []string {
	errors := []string{}

	existsValidator(&errors, "Search term", searchTerm)

	return errors
}
