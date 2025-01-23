import { ReactNode, useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AnimatedNumbers from 'react-animated-numbers';

import { AuthContext } from '@context/AuthContext';
import { useGameStore } from '@store/useGameStore';
import { useOnlineGame } from '@query-hooks/websockets/useOnlineGame';
import { OnlineGame } from '@utils/game/OnlineGame';
import { Modal } from '@components/common/Modal';
import { Heading } from '@components/common/Heading';
import { Button } from '@components/common/Buttons/Button';
import { useUpdateUserRank } from '../../../hooks/useUpdateUserRank';
import { Text } from '@components/common/Text';

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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <Heading variant="h2">
            {winner === turn ? `Well done, you` : `${opponent?.user?.username}`}{' '}
            won!
          </Heading>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Text fontSize="large">Your new rank</Text>
            <AnimatedNumbers
              includeComma
              transitions={(index) => ({
                type: 'spring',
                duration: index + 0.1
              })}
              animateToNumber={
                winner === turn ? user?.rank + 10 : user?.rank - 10
              }
              fontStyle={{
                fontWeight: '500',
                fontSize: '1.4rem'
              }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            handleClick={() => game?.quitGame(navigate, gameId)}
            label="No"
          />
          <Button
            handleClick={() => {
              const { username } = user;
              game?.playAgain({ username }, gameId);
            }}
            label="Yes"
          />
        </div>
      </Modal>
    </>
  );
};
