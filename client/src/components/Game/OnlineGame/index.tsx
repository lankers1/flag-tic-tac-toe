import { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUpdateGameWinnerQuery } from '@query-hooks/game/useUpdateGameWinner';
import { useUpdateUserRankQuery } from '@query-hooks/user/useUpdateUserRank';
import { AuthContext } from '@context/AuthContext';
import { useGameStore } from '@store/useGameStore';
import { useOnlineGame } from '@query-hooks/websockets/useOnlineGame';
import { OnlineGame } from '@utils/game/OnlineGame';
import { Modal } from '@components/Modal';
import { Heading } from '@components/Heading';
import { Button } from '@components/Buttons/Button';

interface Props {
  children: ({
    game
  }: {
    game: InstanceType<typeof OnlineGame> | undefined;
  }) => ReactNode;
}

export const OnlineGameProvider = ({ children, game }: Props) => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const mutation = useUpdateGameWinnerQuery();
  const updateUserRank = useUpdateUserRankQuery();
  const [opponentQuit, setOpponentQuit] = useState(false);
  const user = useContext(AuthContext);
  const { turn, winner } = useGameStore((state) => state);
  useOnlineGame(setOpponentQuit, game);

  async function completeGame() {
    if (winner === turn && gameId && user) {
      const userResponse = await updateUserRank.mutateAsync({
        username: user?.username,
        token: user?.token,
        result: 'win'
      });
      user.setUser({
        ...user,
        rank: userResponse.rank
      });
      return await mutation.mutateAsync({ gameId, username: user?.username });
    }

    if (winner && winner !== turn && gameId && user) {
      const userResponse = await updateUserRank.mutateAsync({
        username: user.username,
        token: user.token,
        result: 'loss'
      });
      user.setUser({
        ...user,
        rank: userResponse.rank
      });
      return;
    }

    if (opponentQuit && gameId && user) {
      const userResponse = await updateUserRank.mutateAsync({
        username: user.username,
        token: user.token,
        result: 'win'
      });
      user.setUser({
        ...user,
        rank: userResponse.rank
      });
      return mutation.mutateAsync({ gameId, username: user?.username });
    }
  }

  useEffect(() => {
    completeGame();
  }, [turn, winner, user?.username, opponentQuit]);

  return (
    <>
      {children}
      <Modal isOpen={opponentQuit}>
        <Heading variant="h2">It looks like your opponent quit!</Heading>
        <Button
          handleClick={() => game?.quitGame(navigate, gameId)}
          label="Back"
        />
      </Modal>
      <Modal isOpen={!!(winner && gameId) && !opponentQuit}>
        <Heading variant="h2">Player {winner} has won! Congrats!!</Heading>
        <p>Do you want to play again?</p>
        <div>
          <Button
            handleClick={() => game?.quitGame(navigate, gameId)}
            label="No"
          />
          <Button
            handleClick={() => {
              const { favouriteFlag, email, username, password, ..._ } = user;
              game?.playAgain(
                { favouriteFlag, email, username, password },
                gameId
              );
            }}
            label="Yes"
          />
        </div>
      </Modal>
    </>
  );
};
