import { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '@context/AuthContext';
import { useGameStore } from '@store/useGameStore';
import { useOnlineGame } from '@query-hooks/websockets/useOnlineGame';
import { OnlineGame } from '@utils/game/OnlineGame';
import { Modal } from '@components/Modal';
import { Heading } from '@components/Heading';
import { Button } from '@components/Buttons/Button';
import { useUpdateUserRank } from '../../../hooks/useUpdateUserRank';

interface Props {
  children: ({
    game
  }: {
    game: InstanceType<typeof OnlineGame> | undefined;
  }) => ReactNode;
}

export const OnlineGameProvider = ({ children, game, opponent }: Props) => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [opponentQuit, setOpponentQuit] = useState(false);
  const user = useContext(AuthContext);
  const { turn, winner } = useGameStore((state) => state);
  useOnlineGame(setOpponentQuit, game);
  useUpdateUserRank(turn, winner, opponentQuit);

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
        <div>
          <Heading variant="h2">
            {winner === turn ? `You` : `${opponent?.user?.username}`} won!
          </Heading>
          <p>Your new rank</p>
          <p>{winner === turn ? `${user?.rank} + 10` : `${user?.rank} - 10`}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
        </div>
      </Modal>
    </>
  );
};
