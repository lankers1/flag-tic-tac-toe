import { SetSelectedFlag } from '@store/useGameStore';
import { NavigateFunction } from 'react-router-dom';

export type OnlineGameArgs = {
  gameId: string | undefined;
  username: string | undefined;
  player: string | undefined;
  setTurn: (turn: number) => void;
  setCorrectAnswer: SetSelectedFlag;
  setIncorrectAnswer: (incorrectAnswer: IncorrectAnswer) => void;
  resetState: () => void;
};

export class OnlineGame {
  setCorrectAnswer;
  setIncorrectAnswer;
  setPlayerTurn;
  resetState;
  gameId;
  socket: WebSocket;
  constructor(args: OnlineGameArgs) {
    this.socket = new WebSocket(
      `${import.meta.env.VITE_WEBSOCKET_PORT}/ws/game/${args.username}/${
        args.gameId
      }`
    );
    this.setPlayerTurn = args.setTurn;
    this.setCorrectAnswer = args.setCorrectAnswer;
    this.setIncorrectAnswer = args.setIncorrectAnswer;
    this.resetState = args.resetState;
    this.quitGame = this.quitGame.bind(this);
    this.playAgain = this.playAgain.bind(this);
    this.gameId = args.gameId;
  }

  setTurn(playerTurn: number) {
    this.setPlayerTurn(playerTurn);
  }

  handleAnswer(
    cb: () => void,
    gameId: string | undefined,
    player: number,
    flagIso: string,
    name: string,
    selectedSquareIndex: number[],
    isCorrect: boolean
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

  quitGame(navigate: NavigateFunction, gameId: string | undefined) {
    this.socket?.send(JSON.stringify({ type: 'quit', gameId }));
    this.socket?.close();
    this.resetState();
    navigate('/');
  }

  playAgain(user: User, gameId: string | undefined) {
    console.log(user);
    this.socket?.send(
      JSON.stringify({ type: 'play-again', username: user.username, gameId })
    );
  }
}
