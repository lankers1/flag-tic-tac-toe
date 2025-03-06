import { useContext, useEffect, useState } from 'react';
import { OnlineGame } from '@utils/game/OnlineGame';
import { AuthContext } from '@context/AuthContext';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import { useGameStore } from '@store/useGameStore';
import { Message } from 'src/type-defs/game';

export const useOnlineGame = (
  setOpponentQuit: (arg: boolean) => void,
  game: InstanceType<typeof OnlineGame> | void
) => {
  const [fullGame, setFullGame] = useState(false);
  const user = useContext(AuthContext);
  const navigate = useNavigate();
  const { resetState } = useGameStore((state) => state);
  const { gameId, player } = useParams();

  useEffect(() => {
    if (game && player !== 'local' && player !== 'computer' && game?.socket) {
      game.socket.onmessage = (event: { data: string }) => {
        try {
          const message = JSON.parse(event?.data);
          handleWsMessage(
            message,
            game,
            setOpponentQuit,
            navigate,
            resetState,
            setFullGame
          );
        } catch (e) {
          console.error(e);
        }
      };
    }
  }, [gameId, player, game, user?.username]);

  return { fullGame };
};

function handleWsMessage(
  message: Message,
  game: InstanceType<typeof OnlineGame>,
  setOpponentQuit: (arg: boolean) => void,
  navigate: NavigateFunction,
  resetState: () => void,
  setFullGame: (fullGame: boolean) => void
) {
  switch (message.type) {
    case 'full-game':
      game.socket.close();
      setFullGame(true);
      break;
    case 'answer':
      const { name, flagIso: iso_2, player, cell } = message;

      if (message.isCorrect) {
        game.handleCorrectAnswer(player, { name, iso_2 }, cell);
      } else {
        game.handleIncorrectAnswer(player, { name, iso_2 }, cell);
      }
      break;
    case 'quit':
      return setOpponentQuit(true);
    case 'play-again':
      const { gameId } = message;
      resetState();
      return navigate(`/game/online/${gameId}`);
    default:
      return;
  }
}
