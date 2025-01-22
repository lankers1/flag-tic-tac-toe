import { determineMove, easyComputer } from '@utils/computer/rulesets';
import { AuthContext } from '@context/AuthContext';
import { useSearchFlagsQuery } from '@query-hooks/flags/useSearchFlags';
import { useGameStore } from '@store/useGameStore';
import { LocalGame } from '@utils/game/LocalGame';
import { ReactNode, useContext, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

interface Props {
  children: ({
    game
  }: {
    game: InstanceType<typeof LocalGame> | undefined;
  }) => ReactNode;
  gameData: { game: Game; answers: Answers };
}

const useInitGame = () => {
  const user = useContext(AuthContext);
  const { setTurn, setCorrectAnswer, resetState, setIncorrectAnswer } =
    useGameStore((state) => state);
  const { gameId, player } = useParams();
  const gameRef = useRef(
    new LocalGame({
      gameId,
      player,
      setTurn,
      setCorrectAnswer,
      setIncorrectAnswer,
      resetState,
      username: user?.username
    })
  );

  return gameRef?.current;
};

export const LocalGameProvider = ({ children, gameData }: Props) => {
  const { data: flags } = useSearchFlagsQuery('');
  const { gameId, player } = useParams();
  const game = useInitGame();

  const {
    setTurn,
    winner,
    currentTurn,
    selectedFlags,
    setIncorrectAnswer,
    setCorrectAnswer
  } = useGameStore((state) => state);

  useEffect(() => {
    let timeout = null;
    if (
      currentTurn === 2 &&
      !winner &&
      flags &&
      player === 'computer' &&
      !gameId
    ) {
      timeout = setTimeout(() => {
        const computerFlag = determineMove(easyComputer, {
          flags,
          selectedFlags,
          answers: gameData.answers,
          setIncorrectAnswer
        });

        if (computerFlag) {
          const { row, col, name, iso_2 } = computerFlag;
          setCorrectAnswer(2, { name, iso_2 }, { row, col });
        }

        setTurn(1);
      }, 2000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [currentTurn, winner, player, gameId]);

  return <>{children({ game })}</>;
};
