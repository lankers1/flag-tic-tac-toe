import { SetSelectedFlag } from '../../store/useGameStore';

type Args = {
  gameId: string;
  setTurn: (turn: number) => void;
  setSelectedFlags: SetSelectedFlag;
  setIncorrectAnswer: (incorrectAnswer: IncorrectAnswer) => void;
};

class OnlineGame {
  setSelectedFlags;
  setIncorrectAnswer;
  setPlayerTurn;
  socket;
  constructor(args: Args) {
    this.socket = new WebSocket(`ws://localhost:8080/ws/game/${args.gameId}`);
    this.setPlayerTurn = args.setTurn;
    this.setSelectedFlags = args.setSelectedFlags;
    this.setIncorrectAnswer = args.setIncorrectAnswer;
  }

  setTurn(playerTurn: number) {
    this.setPlayerTurn(playerTurn);
  }

  handleOpponentsAnswer() {}

  handleCorrectAnswer(
    player: number,
    { name, iso_2 }: Flag,
    answers: string[],
    cell: Cell
  ) {
    this.setSelectedFlags(player, { name, iso_2 }, answers, cell);
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
