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
import styles from './styles.module.scss';
import { useGetUserQuery } from '@query-hooks/user/useGetUser';

interface Props {
  children: ({ game }: { game: InstanceType<typeof OnlineGame> }) => ReactNode;
  game: OnlineGame;
  opponent: { user: PublicUser };
}

export const OnlineGameProvider = ({ children, game, opponent }: Props) => {
  const navigate = useNavigate();
  const [playAgain, setPlayAgain] = useState(false);
  const { gameId } = useParams() as { gameId: string };
  const user = useContext(AuthContext) as UserContext;
  const { turn, winner } = useGameStore((state) => state);
  const { fullGame, opponentQuit, opponentPlayAgain } = useOnlineGame(game);
  const { data: userData } = useGetUserQuery(user?.username);
  useUpdateUserRank(turn, winner, opponentQuit);

  if (fullGame) {
    return (
      <FlexDiv alignItems="center" className={styles.fullGameNotification}>
        <Notification>
          <Text fontSize="large">
            Woops! Looks like this game is full, go back to find a different
            online game
          </Text>
          <div>
            <LinkButton label={'Back'} to={'/'} />
          </div>
        </Notification>
      </FlexDiv>
    );
  }

  return (
    <>
      {children({ game })}
      <Modal isOpen={opponentQuit}>
        <Text>It looks like your opponent quit!</Text>
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
          <FlexDiv className={styles.newRankContent}>
            <Text fontSize="medium">Your new rank</Text>
            <Text fontSize="large">{userData?.user?.rank}</Text>
          </FlexDiv>
          <Text>Do you want to play again?</Text>
          {opponentPlayAgain && !playAgain && (
            <Text>Your opponent wants to play again</Text>
          )}
        </FlexDiv>
        <FlexDiv justifyContent="spaceBetween">
          <Button
            handleClick={() => game?.quitGame(navigate, gameId)}
            label="No"
          />
          <Button
            color="green"
            handleClick={() => {
              setPlayAgain(true);
              game?.playAgain();
            }}
            label="Yes"
          />
        </FlexDiv>
      </Modal>
    </>
  );
};
