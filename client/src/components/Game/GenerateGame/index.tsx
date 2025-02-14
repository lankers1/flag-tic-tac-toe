import { useParams } from 'react-router-dom';
import { OnlineGameProvider } from '../OnlineGame';
import { LocalGameProvider } from '../LocalGame';
import { OnlineGame } from '@utils/game/OnlineGame';
import { ReactNode, useContext, useState } from 'react';
import { useGameStore } from '@store/useGameStore';
import { AuthContext } from '@context/AuthContext';
import { useOnMountUnsafe } from '@pages/Game';
import { LocalGame } from '@utils/game/LocalGame';

interface Props {
  children: ({ game }: { game: InstanceType<typeof OnlineGame> }) => ReactNode;
  gameData: { game: Game; answers: Answers };
}

export const GenerateGame = ({ children, gameData, opponent }: Props) => {
  const [game, setGame] = useState<InstanceType<typeof OnlineGame> | null>(
    null
  );
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
    } else if (!game) {
      setGame(true);
    }
  }, [gameId, game]);

  if (game) {
    if (gameId) {
      return (
        <OnlineGameProvider opponent={opponent} game={game}>
          {children({ game })}
        </OnlineGameProvider>
      );
    } else {
      return (
        <LocalGameProvider gameData={gameData}>
          {({ game }) => children({ game })}
        </LocalGameProvider>
      );
    }
  }

  return null;
};
