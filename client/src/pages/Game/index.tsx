import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useGameStore } from '../../store/useGameStore';

import styles from './styles.module.scss';

import { Gameboard } from '@components/Game/Gameboard';
import { GenerateGame } from '@components/Game/GenerateGame';
import { AuthContext, UserContext } from '@context/AuthContext';
import { ActionButtons } from '@components/Game/ActionButtons';
import { AnswerModalContent } from '@components/Game/AnswerModalContent';
import { Board, Game as GameType } from '@type-defs/game';
import { PublicUser } from '@type-defs/user';
import { PlayerNotification } from '@components/Game/PlayerNotification';
import { Modal } from '@components/common/Modal';

interface Props {
  gameData: { game: GameType; answers: Answers };
  board: Board;
  opponent?: { user: PublicUser };
  refetch: () => void;
}

export const Game = ({ gameData, board, opponent, refetch }: Props) => {
  const user = useContext(AuthContext);
  const { gameId } = useParams();
  const [selectedSquare, setSelectedSquare] = useState<[number, number]>([
    0, 0
  ]);

  const { turn, winner, resetState } = useGameStore((state) => state);

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
              <div
                style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}
              >
                {gameId ? (
                  determineOrder(user, opponent?.user, turn).map(
                    (user, index) => (
                      <PlayerNotification
                        key={user?.username}
                        user={user}
                        index={index}
                      />
                    )
                  )
                ) : (
                  <PlayerNotification />
                )}
              </div>
              <div className={styles.gameboardContainer}>
                <Gameboard handleClick={handleClick} data={board} />
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

function determineOrder(
  user: UserContext | null,
  opponentData: PublicUser | undefined,
  turn: number
) {
  if (turn === 1) {
    return [user, opponentData];
  }

  return [opponentData, user];
}
