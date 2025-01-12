import { EffectCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
import { game, useInitGame } from './InitGame';
import { Heading } from '@components/Heading';
import { Button } from '@components/Buttons/Button';
import { AuthContext } from '../../context/AuthContext';

export function useOnMountUnsafe(effect: EffectCallback, dependencies: any[]) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return effect();
    }
    initialized.current = true;
  }, dependencies);
}

export const Game = () => {
  const user = useContext(AuthContext);
  const navigate = useNavigate();
  const [opponentQuit, setOpponentQuit] = useState(false);
  const [opponentReplay, setOpponentReplay] = useState<boolean | null>(null);
  const { gameId, player } = useParams();
  const { data: flags } = useSearchFlags('');
  const [selectedSquare, setSelectedSquare] = useState<[number, number]>([
    0, 0
  ]);
  const { data, isLoading, isPending, error, refetch } = useGetGameQuery();
  useInitGame(setOpponentQuit, setOpponentReplay);
  const {
    turn,
    setTurn,
    winner,
    currentTurn,
    resetState,
    selectedFlags,
    setIncorrectAnswer,
    setCorrectAnswer
  } = useGameStore((state) => state);

  useEffect(() => {
    let timeout = null;
    if (
      currentTurn === 2 &&
      !winner &&
      flags &&
      player === 'computer' &&
      !gameId
    ) {
      timeout = setTimeout(() => {
        const computerFlag = determineMove(easyComputer, {
          flags,
          selectedFlags,
          answers: data.answers,
          setIncorrectAnswer
        });

        if (computerFlag) {
          const { row, col, name, iso_2 } = computerFlag;
          setCorrectAnswer(2, { name, iso_2 }, { row, col });
        }

        setTurn(1);
      }, 2000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [currentTurn, winner, player, gameId]);

  useOnMountUnsafe(() => {
    return () => {
      game?.quitGame(navigate, gameId);
    };
  }, []);

  // useEffect(() => {
  //   if(opponentQuit === false) {
  //     game?.quitGame(navigate, gameId);
  //   } else {

  //   }
  // }, [])

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
    resetState();
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
                  ? `It's player ones turn!`
                  : "It's player twos turn!"}
              </p>
            )}
          </Notification>
          <div className={styles.gameboardContainer}>
            <Gameboard
              handleClick={handleClick}
              data={gameId ? data?.game.board : data?.game}
            />
          </div>
        </div>
        <ActionButtons
          quitGame={game.quitGame}
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
      <Modal isOpen={opponentQuit}>
        <Heading variant="h2">It looks like your opponent quit!</Heading>
        <Button
          handleClick={() => game.quitGame(navigate, gameId)}
          label="Back"
        />
      </Modal>
      <Modal isOpen={!!(winner && gameId)}>
        <Heading variant="h2">Player {winner} has won! Congrats!!</Heading>
        <p>Do you want to play again?</p>
        <div>
          <Button
            handleClick={() => game.quitGame(navigate, gameId)}
            label="No"
          />
          <Button handleClick={() => game.playAgain(user)} label="Yes" />
        </div>
      </Modal>
    </>
  );
};
