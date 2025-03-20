import { useParams } from 'react-router-dom';
import { FlagAvatar } from '@components/common/FlagAvatar';
import { Text } from '@components/common/Text';
import { Clock } from '@components/common/Clock';
import { Notification } from '@components/common/Notification';
import { FlexDiv } from '@components/common/FlexDiv';

import styles from './styles.module.scss';
import { useGameStore } from '@store/useGameStore';
import { PublicUser } from '@type-defs/user';
import { useGetUserQuery } from '@query-hooks/user/useGetUser';

interface Props {
  index?: number;
  user?: PublicUser | null;
}

function turnNotification(
  gameId: string | undefined,
  currentTurn: number,
  turn: number,
  player: string
) {
  if (gameId) {
    const yourTurn = currentTurn === turn;
    if (yourTurn) {
      return "It's your turn!";
    } else {
      return "It's your opponents turn!";
    }
  } else {
    if (player === 'local') {
      if (currentTurn === 1) {
        return "It's player one's turn!";
      } else {
        return "It's player two's turn!";
      }
    } else {
      if (currentTurn === 1) {
        return "It's your turn!";
      } else {
        return "It's the computer's turn!";
      }
    }
  }
}

function winnerNotification(player: string, winner: number) {
  if (player === 'local') {
    return `Player ${winner} has won! Congrats!!`;
  } else {
    if (winner === 1) {
      return 'You won! Congrats!!';
    } else {
      return 'The computer won! Better luck next time!';
    }
  }
}

export const PlayerNotification = ({ index, user }: Props) => {
  const { turn, winner, currentTurn } = useGameStore((state) => state);
  const { gameId, player } = useParams() as { gameId: string; player: string };
  const { data: userData } = useGetUserQuery(user?.username as string);

  if (!gameId) {
    return (
      <Notification type={currentTurn === 1 ? 'playerOne' : 'playerTwo'}>
        {!!winner ? (
          <Text fontSize="large">{winnerNotification(player, winner)}</Text>
        ) : (
          <Text fontSize="large">
            {turnNotification(gameId, currentTurn, turn, player)}
          </Text>
        )}
      </Notification>
    );
  }
  if (user) {
    return (
      <>
        <Notification type={index === 0 ? 'playerOne' : 'playerTwo'}>
          <FlexDiv className={styles.notificationContainer}>
            <FlagAvatar flagIso2={user.favouriteFlag} />
            <div className={styles.playerDetails}>
              <Text fontSize="medium">{user?.username}</Text>
              <Text fontSize="small">{userData?.user?.rank}</Text>
            </div>
          </FlexDiv>
        </Notification>
        {index === 0 && <Clock size={100} />}
      </>
    );
  }
};
