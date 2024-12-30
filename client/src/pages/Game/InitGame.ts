import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SetSelectedFlag, useGameStore } from '../../store/useGameStore';
import { answerMap } from './components/AnswerModalContent';

type Args = {
  gameId: string;
  setTurn: (turn: number) => void;
  setCorrectAnswer: SetSelectedFlag;
  setIncorrectAnswer: (incorrectAnswer: IncorrectAnswer) => void;
};

export class OnlineGame {
  setCorrectAnswer;
  setIncorrectAnswer;
  setPlayerTurn;
  socket: WebSocket;
  constructor(args: Args) {
    this.socket = new WebSocket(`ws://localhost:8080/ws/game/${args.gameId}`);
    this.setPlayerTurn = args.setTurn;
    this.setCorrectAnswer = args.setCorrectAnswer;
    this.setIncorrectAnswer = args.setIncorrectAnswer;
  }

  setTurn(playerTurn: number) {
    this.setPlayerTurn(playerTurn);
  }

  handleAnswer(
    cb: () => void,
    gameId,
    player,
    flagIso,
    name,
    selectedSquareIndex,
    isCorrect
  ) {
    this.socket.send(
      JSON.stringify({
        type: 'turn',
        gameId: gameId,
        player,
        isCorrect,
        flagIso,
        name,
        cell: {
          row: selectedSquareIndex[0] - 1,
          col: selectedSquareIndex[1] - 1
        }
      })
    );
    cb();
  }

  handleCorrectAnswer(
    player: number,
    { name, iso_2 }: Flag,
    answers: string[],
    cell: Cell
  ) {
    this.setCorrectAnswer(player, { name, iso_2 }, answers, cell);
  }

  handleIncorrectAnswer(player: number, flag: Flag, cell: Cell) {
    this.setIncorrectAnswer({ player, flag, cell });
  }

  quitGame() {
    this.socket?.close();
  }
}

export const initGame = (args: Args) => {
  return new OnlineGame(args);
};

export let game;

export const useInitGame = (answers) => {
  const { turn, setTurn, setCorrectAnswer, setIncorrectAnswer } = useGameStore(
    (state) => state
  );
  const { gameId } = useParams();

  useEffect(() => {
    if (gameId && answers) {
      game = initGame({
        gameId,
        setTurn,
        setCorrectAnswer,
        setIncorrectAnswer
      });
      if (game) {
        game.socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            handleWsMessage(message, answers);
          } catch (e) {
            console.error(e);
          }
        };
      }

      return () => {
        game.quitGame();
      };
    }
  }, [gameId, turn, JSON.stringify(answers)]);
};

function handleWsMessage(message, answers) {
  switch (message.type) {
    case 'metadata':
      game?.setTurn(message.playerTurn);
      break;
    case 'turn':
      const { name, flagIso: iso_2, player, cell } = message;
      if (message.isCorrect) {
        const answerKey = answerMap[message.cell.row][message.cell.col];
        const answerArr = answers[answerKey];
        game.handleCorrectAnswer(player, { name, iso_2 }, answerArr, cell);
      } else {
        game.handleIncorrectAnswer(player, { name, iso_2 }, cell);
      }
      break;
    default:
      return;
  }
}
