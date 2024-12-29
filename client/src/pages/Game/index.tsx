import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Gameboard } from '../../components/Gameboard';
import { useGetGameQuery } from '../../query-hooks/getGame';
import { Modal } from '../../components/Modal';
import { useGameStore } from '../../store/useGameStore';
import { Notification } from '../../components/Notification';
import { determineMove, easyComputer } from '../../computer/rulesets';
import { useSearchFlags } from '../../query-hooks/searchFlags';
import { Loader } from '../../components/Loader';

import styles from './styles.module.scss';

import { AnswerModalContent } from './components/AnswerModalContent';
import { ActionButtons } from './components/ActionButtons';
import { useInitGame } from './InitGame';

export const Game = () => {
  const { gameId } = useParams();
  const { data: flags } = useSearchFlags('');
  const [selectedSquare, setSelectedSquare] = useState<[number, number]>([
    0, 0
  ]);
  const { data, isLoading, isPending, error, refetch } = useGetGameQuery();
  useInitGame(data?.answers);
  const { turn, winner, currentTurn, reset } = useGameStore((state) => state);

  // useEffect(() => {
  //   let timeout = null;
  //   if (
  //     playersTurn === 2 &&
  //     !winner &&
  //     flags &&
  //     player === 'computer' &&
  //     !gameId
  //   ) {
  //     timeout = setTimeout(() => {
  //       const computerFlag = determineMove(easyComputer, {
  //         flags,
  //         selectedFlags,
  //         answers: data.answers,
  //         setIncorrectAnswer
  //       });

  //       if (computerFlag) {
  //         const { row, col, name, iso_2, answerArr, playersTurn } =
  //           computerFlag;
  //         setSelectedFlags(row, col, name, iso_2, answerArr, playersTurn);
  //       }

  //       togglePlayerTurn();
  //     }, 2000);
  //   }

  //   return () => {
  //     if (timeout) {
  //       clearTimeout(timeout);
  //     }
  //   };
  // }, [playersTurn, winner, player, gameId]);

  if (isLoading || isPending) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}>
          <Loader />
        </div>
      </div>
    );
  }

  if (error) return <p>Error... {error.message}</p>;

  function handleClick(outerIndex: number, innerIndex: number) {
    setSelectedSquare([outerIndex + 1, innerIndex + 1]);
  }

  function handleReset() {
    refetch();
    reset();
  }

  return (
    <>
      <div className={styles.pageContainer}>
        <div className={styles.container}>
          <Notification
            backgroundColor={
              currentTurn === 1 || winner === 1 ? '#b0ddff' : '#C4FFBF'
            }
          >
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
                  ? `It's your turn!`
                  : "It's your opponents turn!"}
              </p>
            )}
          </Notification>
          <div className={styles.gameboardContainer}>
            <Gameboard handleClick={handleClick} data={data?.game} />
          </div>
        </div>
        <ActionButtons
          resetQuery={reset}
          handleResetGame={handleReset}
          winner={winner}
        />
      </div>
      <Modal isOpen={!!selectedSquare[0]}>
        <AnswerModalContent
          answers={data?.answers}
          selectedSquareIndex={selectedSquare}
          closeModal={() => setSelectedSquare([0, 0])}
        />
      </Modal>
    </>
  );
};
