import { SetSelectedFlag } from '../../store/useGameStore';

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
  socket;
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
