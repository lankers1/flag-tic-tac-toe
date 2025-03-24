package models

type Flag struct {
	Iso2 string `json:"iso_2"`
	Name string `json:"name"`
}

type Characteristic struct {
	Name string `json:"name"`
	Type string `json:"type"`
}

type FlagCharacteristics struct {
	Iso2            string           `json:"iso_2"`
	Name            string           `json:"name"`
	Characteristics []Characteristic `json:"characteristics"`
}

type Characteristics struct {
	CharacteristicId string `json:"characteristicId"`
	Name             string `json:"name"`
	Type             string `json:"type"`
}
