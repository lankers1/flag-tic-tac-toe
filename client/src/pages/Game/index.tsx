import { EffectCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Gameboard } from '../../components/Gameboard';
import { Modal } from '../../components/Modal';
import { useGameStore } from '../../store/useGameStore';
import { Notification } from '../../components/Notification';
import { determineMove, easyComputer } from '../../computer/rulesets';
import { useSearchFlags } from '../../query-hooks/searchFlags';

import styles from './styles.module.scss';

import { AnswerModalContent } from './components/AnswerModalContent';
import { ActionButtons } from './components/ActionButtons';
import { game, useInitGame } from './InitGame';
import { Heading } from '@components/Heading';
import { Button } from '@components/Buttons/Button';
import { AuthContext } from '../../context/AuthContext';
import { FlagAvatar } from '@components/FlagAvatar';
import { useUpdateGameWinner } from '@query-hooks/updateGameWinner';

export function useOnMountUnsafe(effect: EffectCallback, dependencies: any[]) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return effect();
    }
    initialized.current = true;
  }, dependencies);
}

export const Game = ({ gameData, opponent, refetch }) => {
  const mutation = useUpdateGameWinner();
  const user = useContext(AuthContext);
  const navigate = useNavigate();
  const [opponentQuit, setOpponentQuit] = useState(false);
  const { gameId, player } = useParams();
  const { data: flags } = useSearchFlags('');
  const [selectedSquare, setSelectedSquare] = useState<[number, number]>([
    0, 0
  ]);

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
  useInitGame(setOpponentQuit);

  useEffect(() => {
    if (winner === turn && gameId && user) {
      return mutation.mutate({ gameId, username: user?.username });
    }

    if (opponentQuit && gameId && user) {
      return mutation.mutate({ gameId, username: user?.username });
    }
  }, [turn, winner, user?.username, opponentQuit]);

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
          answers: gameData.answers,
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
          <div style={{ display: 'flex', gap: '2rem' }}>
            {determineOrder(user, opponent?.user, turn).map((user, index) => (
              <PlayerNotification
                user={user}
                currentTurn={currentTurn}
                turn={turn}
                key={user?.username}
                index={index}
              />
            ))}
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
      <Modal isOpen={opponentQuit}>
        <Heading variant="h2">It looks like your opponent quit!</Heading>
        <Button
          handleClick={() => game.quitGame(navigate, gameId)}
          label="Back"
        />
      </Modal>
      <Modal isOpen={!!selectedSquare[0]}>
        <AnswerModalContent
          answers={gameData?.answers}
          selectedSquareIndex={selectedSquare}
          closeModal={() => setSelectedSquare([0, 0])}
        />
      </Modal>

      <Modal isOpen={!!(winner && gameId) && !opponentQuit}>
        <Heading variant="h2">Player {winner} has won! Congrats!!</Heading>
        <p>Do you want to play again?</p>
        <div>
          <Button
            handleClick={() => game.quitGame(navigate, gameId)}
            label="No"
          />
          <Button
            handleClick={() => {
              game.playAgain(user, gameId);
            }}
            label="Yes"
          />
        </div>
      </Modal>
    </>
  );
};

const PlayerNotification = ({ user, currentTurn, index, turn }) => {
  return (
    <Notification
      active={currentTurn - 1 === index}
      backgroundColor={index === 0 ? '#b0ddff' : '#C4FFBF'}
    >
      <div style={{ display: 'flex' }}>
        <FlagAvatar flagIso2={user?.favouriteFlag} />
        <div>
          <p style={{ marginLeft: '0.5rem', fontSize: '1rem' }}>
            {turn - 1 === index ? 'You' : 'Opponent'}
          </p>
          <p
            style={{
              marginLeft: '0.5rem',
              fontSize: '1.3rem',
              fontWeight: 500
            }}
          >
            {user.username}
          </p>
          <p style={{ marginLeft: '0.5rem', fontSize: '1rem' }}>{user.rank}</p>
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
{
  /* {!!winner ? (
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
              )} */
}
