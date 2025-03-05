import { NavigateFunction } from 'react-router-dom';
import { SetSelectedFlag } from '@store/useGameStore';
import { IncorrectAnswer } from '@types/game';

type Args = {
  gameId: string | undefined;
  username: string | undefined;
  player: string | undefined;
  setTurn: (turn: number) => void;
  setCorrectAnswer: SetSelectedFlag;
  setIncorrectAnswer: (incorrectAnswer: IncorrectAnswer) => void;
  resetState: () => void;
};

export class LocalGame {
  setCorrectAnswer;
  setIncorrectAnswer;
  setPlayerTurn;
  socket: null;
  resetState;
  constructor(args: Args) {
    this.setPlayerTurn = args.setTurn;
    this.setCorrectAnswer = args.setCorrectAnswer;
    this.setIncorrectAnswer = args.setIncorrectAnswer;
    this.socket = null;
    this.resetState = args.resetState;
    this.quitGame = this.quitGame.bind(this);
  }

  setTurn(playerTurn: number) {
    this.setPlayerTurn(playerTurn);
  }

  handleAnswer(
    cb: () => void,
    player: number,
    flagIso: string,
    name: string,
    selectedSquareIndex: number[],
    isCorrect: boolean
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

  quitGame(navigate: NavigateFunction, _: string | undefined) {
    this.resetState();
    navigate('/');
  }
}
