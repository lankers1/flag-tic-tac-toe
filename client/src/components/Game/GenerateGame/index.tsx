import { useParams } from 'react-router-dom';
import { OnlineGameProvider } from '../OnlineGame';
import { LocalGameProvider } from '../LocalGame';
import { LocalGame } from '@utils/game/LocalGame';
import { OnlineGame } from '@utils/game/OnlineGame';
import { ReactNode, useContext, useEffect, useState } from 'react';
import { useGameStore } from '@store/useGameStore';
import { AuthContext } from '@context/AuthContext';
import { useOnMountUnsafe } from '@pages/Game';

interface Props {
  children: ({
    game
  }: {
    game: InstanceType<typeof LocalGame> | OnlineGame;
  }) => ReactNode;
  gameData: { game: Game; answers: Answers };
}

export const GenerateGame = ({ children, gameData }: Props) => {
  const [game, setGame] = useState();
  const { gameId, player } = useParams();
  const user = useContext(AuthContext);
  const { setTurn, setCorrectAnswer, resetState, setIncorrectAnswer } =
    useGameStore((state) => state);

  useOnMountUnsafe(() => {
    if (gameId && !game) {
      setGame(
        new OnlineGame({
          gameId,
          player,
          setTurn,
          setCorrectAnswer,
          setIncorrectAnswer,
          resetState,
          username: user?.username
        })
      );
    }
  }, [gameId, game]);

  if (game) {
    if (gameId) {
      return (
        <OnlineGameProvider game={game}>
          {children({ game })}
        </OnlineGameProvider>
      );
    } else {
      return (
        <LocalGameProvider gameData={gameData}>
          {children({ game })}
        </LocalGameProvider>
      );
    }
  }

  return null;
};
