import { useParams } from 'react-router-dom';
import { FlagAvatar } from '@components/common/FlagAvatar';
import { Text } from '@components/common/Text';
import { Clock } from '@components/common/Clock';
import { Notification } from '@components/common/Notification';
import { AuthContext, UserContext } from '@context/AuthContext';
import { FlexDiv } from '@components/common/FlexDiv';

import styles from './styles.module.scss';
import { useGameStore } from '@store/useGameStore';
import { useContext } from 'react';

interface Props {
  index?: number;
}

function turnNotification(
  gameId: string | undefined,
  currentTurn: number,
  turn: number
) {
  if (gameId) {
    const yourTurn = currentTurn === turn;
    if (yourTurn) {
      return "It's your turn!";
    } else {
      return "It's your opponents turn!";
    }
  } else {
    if (currentTurn === 1) {
      return "It's player ones turn!";
    } else {
      return "It's player twos turn!";
    }
  }
}

export const PlayerNotification = ({ index }: Props) => {
  const { turn, winner, currentTurn } = useGameStore((state) => state);
  const user = useContext(AuthContext);

  const { gameId } = useParams();

  if (!gameId) {
    return (
      <Notification>
        <p>
          {!!winner ? (
            <Text fontSize="large">Player {winner} has won! Congrats!!</Text>
          ) : (
            <Text fontSize="large">
              {turnNotification(gameId, currentTurn, turn)}
            </Text>
          )}
        </p>
      </Notification>
    );
  }
  return (
    <>
      <Notification
        active={currentTurn - 1 === index}
        type={index === 0 ? 'playerOne' : 'playerTwo'}
      >
        <FlexDiv>
          <FlagAvatar flagIso2={user?.favouriteFlag} />
          <div className={styles.playerDetails}>
            <Text fontSize="large">{user?.username}</Text>
            <Text fontSize="small">{user?.rank}</Text>
          </div>
        </FlexDiv>
      </Notification>
      {index === 0 && <Clock size={100} />}
    </>
  );
};
