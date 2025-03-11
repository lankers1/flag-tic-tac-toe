import { ReactNode, useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AuthContext, UserContext } from '@context/AuthContext';
import { useGameStore } from '@store/useGameStore';
import { useOnlineGame } from '@query-hooks/websockets/useOnlineGame';
import { OnlineGame } from '@utils/game/OnlineGame';
import { Modal } from '@components/common/Modal';
import { Heading } from '@components/common/Heading';
import { Button } from '@components/common/Buttons/Button';
import { useUpdateUserRank } from '../../../hooks/useUpdateUserRank';
import { Text } from '@components/common/Text';
import { Notification } from '@components/common/Notification';
import { LinkButton } from '@components/common/Buttons/LinkButton';
import { FlexDiv } from '@components/common/FlexDiv';
import { PublicUser } from '@type-defs/user';

interface Props {
  children: ({ game }: { game: InstanceType<typeof OnlineGame> }) => ReactNode;
  game: OnlineGame;
  opponent: { user: PublicUser };
}

export const OnlineGameProvider = ({ children, game, opponent }: Props) => {
  const navigate = useNavigate();
  const { gameId } = useParams() as { gameId: string };
  const [opponentQuit, setOpponentQuit] = useState(false);
  const user = useContext(AuthContext) as UserContext;
  const { turn, winner } = useGameStore((state) => state);
  const { fullGame } = useOnlineGame(setOpponentQuit, game);
  useUpdateUserRank(turn, winner, opponentQuit);

  if (fullGame) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
        <Notification>
          <Text fontSize="large">
            Woops! Looks like this game is full, go back to find a different
            online game
          </Text>
          <div>
            <LinkButton label={'Back'} to={'/'} />
          </div>
        </Notification>
      </div>
    );
  }

  return (
    <>
      {children({ game })}
      <Modal isOpen={opponentQuit}>
        <Heading variant="h2">It looks like your opponent quit!</Heading>
        <Button
          handleClick={() => game?.quitGame(navigate, gameId)}
          label="Back"
        />
      </Modal>
      <Modal isOpen={!!(winner && gameId) && !opponentQuit}>
        <FlexDiv alignItems="center" flexDirection="col">
          <Heading variant="h2">
            {winner === turn
              ? `Well done, you`
              : `Your opponent ${opponent?.user?.username}`}{' '}
            won!
          </Heading>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Text fontSize="medium">Your new rank</Text>
            <Text fontSize="large">{user?.rank}</Text>
          </div>
        </FlexDiv>
        <Text>Do you want to play again?</Text>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            handleClick={() => game?.quitGame(navigate, gameId)}
            label="No"
          />
          <Button
            handleClick={() => {
              game?.playAgain();
            }}
            label="Yes"
          />
        </div>
      </Modal>
    </>
  );
};
