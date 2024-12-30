import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SetSelectedFlag, useGameStore } from '../../store/useGameStore';

type Args = {
  gameId: string | undefined;
  player: string;
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

  handleCorrectAnswer(player: number, { name, iso_2 }: Flag, cell: Cell) {
    this.setCorrectAnswer(player, { name, iso_2 }, cell);
  }

  handleIncorrectAnswer(player: number, flag: Flag, cell: Cell) {
    this.setIncorrectAnswer({ player, flag, cell });
  }

  quitGame() {
    this.socket?.close();
  }
}

export class LocalGame {
  setCorrectAnswer;
  setIncorrectAnswer;
  setPlayerTurn;
  constructor(args: Args) {
    this.setPlayerTurn = args.setTurn;
    this.setCorrectAnswer = args.setCorrectAnswer;
    this.setIncorrectAnswer = args.setIncorrectAnswer;
  }

  setTurn(playerTurn: number) {
    this.setPlayerTurn(playerTurn);
  }

  handleAnswer(
    cb: () => void,
    _,
    player,
    flagIso,
    name,
    selectedSquareIndex,
    isCorrect
  ) {
    const flag = { name, iso_2: flagIso };
    const cell = {
      row: selectedSquareIndex[0] - 1,
      col: selectedSquareIndex[1] - 1
    };

    if (isCorrect) {
      this.handleCorrectAnswer(player, flag, cell);
    } else {
      this.handleIncorrectAnswer(player, flag, cell);
    }
    cb();
  }

  handleCorrectAnswer(player: number, flag: Flag, cell: Cell) {
    this.setCorrectAnswer(player, flag, cell);
  }

  handleIncorrectAnswer(player: number, flag: Flag, cell: Cell) {
    this.setIncorrectAnswer({ player, flag, cell });
  }

  quitGame() {
    return () => null;
  }
}

export const initGame = (args: Args) => {
  if (args.player === 'local') {
    return new LocalGame(args);
  }
  return new OnlineGame(args);
};

export let game;

export const useInitGame = () => {
  const { turn, setTurn, setCorrectAnswer, setIncorrectAnswer } = useGameStore(
    (state) => state
  );
  const { gameId, player } = useParams();

  useEffect(() => {
    if (player) {
      game = initGame({
        gameId,
        player,
        setTurn,
        setCorrectAnswer,
        setIncorrectAnswer
      });
      if (game && player !== 'local') {
        game.socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            handleWsMessage(message);
          } catch (e) {
            console.error(e);
          }
        };
      }

      return () => {
        game.quitGame();
      };
    }
  }, [gameId, turn, player]);
};

function handleWsMessage(message) {
  switch (message.type) {
    case 'metadata':
      game?.setTurn(message.playerTurn);
      break;
    case 'turn':
      const { name, flagIso: iso_2, player, cell } = message;
      if (message.isCorrect) {
        game.handleCorrectAnswer(player, { name, iso_2 }, cell);
      } else {
        game.handleIncorrectAnswer(player, { name, iso_2 }, cell);
      }
      break;
    default:
      return;
  }
}
