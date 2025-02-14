import { EffectCallback, useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Modal } from '../../components/common/Modal';
import { useGameStore } from '../../store/useGameStore';
import { Notification } from '../../components/common/Notification';

import styles from './styles.module.scss';

import { FlagAvatar } from '@components/common/FlagAvatar';
import { Gameboard } from '@components/Game/Gameboard';
import { GenerateGame } from '@components/Game/GenerateGame';
import { AuthContext } from '@context/AuthContext';
import { Text } from '@components/common/Text';
import { ActionButtons } from '@components/Game/ActionButtons';
import { AnswerModalContent } from '@components/Game/AnswerModalContent';

export function useOnMountUnsafe(effect: EffectCallback, dependencies: any[]) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return effect();
    }
    initialized.current = true;
  }, dependencies);
}

interface Props {
  gameData: { game: Game; answers: Answers };
  opponent?: { user: User };
  refetch: () => void;
}

export const Game = ({ gameData, opponent, refetch }: Props) => {
  const user = useContext(AuthContext);
  const { gameId } = useParams();
  const [selectedSquare, setSelectedSquare] = useState<[number, number]>([
    0, 0
  ]);

  const { turn, winner, currentTurn, resetState } = useGameStore(
    (state) => state
  );

  function handleClick(outerIndex: number, innerIndex: number) {
    setSelectedSquare([outerIndex + 1, innerIndex + 1]);
  }

  function handleReset() {
    refetch();
    resetState();
  }

  return (
    <GenerateGame gameData={gameData} opponent={opponent}>
      {({ game }) => (
        <>
          <div className={styles.pageContainer}>
            <div className={styles.container}>
              <div style={{ display: 'flex', gap: '2rem' }}>
                {determineOrder(user, opponent?.user, turn).map(
                  (user, index) => (
                    <PlayerNotification
                      winner={winner}
                      user={user}
                      currentTurn={currentTurn}
                      turn={turn}
                      key={user?.username}
                      index={index}
                    />
                  )
                )}
              </div>
              <div className={styles.gameboardContainer}>
                <Gameboard
                  handleClick={handleClick}
                  data={gameId ? gameData?.game.board : gameData?.game}
                />
              </div>
            </div>
            <ActionButtons
              quitGame={game?.quitGame}
              handleResetGame={handleReset}
              winner={winner}
            />
          </div>
          <Modal isOpen={!!selectedSquare[0]}>
            <AnswerModalContent
              answers={gameData?.answers}
              selectedSquareIndex={selectedSquare}
              closeModal={() => setSelectedSquare([0, 0])}
              game={game}
            />
          </Modal>
        </>
      )}
    </GenerateGame>
  );
};

const PlayerNotification = ({ user, currentTurn, index, turn, winner }) => {
  const { gameId } = useParams();

  if (!gameId) {
    return (
      <Notification>
        <p>
          {!!winner ? (
            <p className={styles.notificationText}>
              Player {winner} has won! Congrats!!
            </p>
          ) : (
            <p className={styles.notificationText}>
              {gameId
                ? currentTurn === turn
                  ? `It's your turn!`
                  : "It's your opponents turn!"
                : currentTurn === 1
                ? `It's player ones turn!`
                : "It's player twos turn!"}
            </p>
          )}
        </p>
      </Notification>
    );
  }
  return (
    <Notification
      active={currentTurn - 1 === index}
      backgroundColor={index === 0 ? '#b0ddff' : '#C4FFBF'}
    >
      <div style={{ display: 'flex' }}>
        <FlagAvatar flagIso2={user?.favouriteFlag} />
        <div>
          <Text fontSize="small">
            {turn - 1 === index ? 'You' : 'Opponent'}
          </Text>
          <Text fontSize="large">{user?.username}</Text>
          <Text fontSize="small">{user?.rank}</Text>
        </div>
      </div>
    </Notification>
  );
};

function determineOrder(user, opponentData, turn) {
  if (turn === 1) {
    return [user, opponentData];
  }

  return [opponentData, user];
}
