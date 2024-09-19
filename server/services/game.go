package services

import "fttt/models"
import "fttt/repositories"

type GameService struct {
 repo *repositories.GameRepository
}

func InitGameService(r *repositories.GameRepository) *GameService {
 return &GameService{r}
}

func (s *GameService) GetGame() (*models.Game, error) {
 game, err := s.repo.GetGame()
 if err != nil {
  return nil, err
 }

 return game, nil
}
