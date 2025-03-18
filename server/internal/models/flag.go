package models

type Flag struct {
	Iso2 string `json:"iso_2"`
	Name string `json:"name"`
}

type FlagCharacteristics struct {
	Iso2            string   `json:"iso_2"`
	Name            string   `json:"name"`
	Characteristics []string `json:"characteristics"`
}
