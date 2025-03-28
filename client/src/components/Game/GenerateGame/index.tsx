import { useParams } from 'react-router-dom';
import { OnlineGameProvider } from '../OnlineGame';
import { LocalGameProvider } from '../LocalGame';
import { OnlineGame } from '@utils/game/OnlineGame';
import { ReactNode, useContext, useEffect, useState } from 'react';
import { useGameStore } from '@store/useGameStore';
import { AuthContext } from '@context/AuthContext';
import { useSendAnswer } from '@query-hooks/game/useSendAnswer';
import { useSendPlayAgain } from '@query-hooks/game/useSendPlayAgain';
import { useSendQuitGame } from '@query-hooks/game/useSendQuitGame';
import { Answers, Game } from '@type-defs/game';
import { PublicUser } from '@type-defs/user';
import { LocalGame } from '@utils/game/LocalGame';

interface Props {
  children: ({
    game
  }: {
    game: InstanceType<typeof OnlineGame | typeof LocalGame>;
  }) => ReactNode;
  gameData: { game: Game; answers: Answers };
  opponent?: { user: PublicUser };
}

export const GenerateGame = ({ children, gameData, opponent }: Props) => {
  const sendAnswerMutation = useSendAnswer();
  const quitGameMutation = useSendQuitGame();
  const playAgainMutation = useSendPlayAgain();

  const [game, setGame] = useState<InstanceType<typeof OnlineGame> | boolean>(
    false
  );
  const { gameId, player } = useParams();
  const user = useContext(AuthContext);
  const { setCorrectAnswer, resetState, setIncorrectAnswer } = useGameStore(
    (state) => state
  );

  useEffect(() => {
    if (gameId && !game) {
      setGame(
        new OnlineGame({
          gameId,
          player,
          setCorrectAnswer,
          setIncorrectAnswer,
          resetState,
          sendAnswer: sendAnswerMutation.mutateAsync,
          sendPlayAgain: playAgainMutation.mutateAsync,
          sendQuitGame: quitGameMutation.mutateAsync,
          username: user?.username
        })
      );
    } else if (!game) {
      setGame(true);
    }
  }, [gameId, game]);

  if (game) {
    if (gameId && opponent && game instanceof OnlineGame) {
      return (
        <OnlineGameProvider opponent={opponent} game={game}>
          {({ game }) => children({ game })}
        </OnlineGameProvider>
      );
    }
    return (
      <LocalGameProvider gameData={gameData}>
        {({ game }) => children({ game })}
      </LocalGameProvider>
    );
  }

  return null;
};
