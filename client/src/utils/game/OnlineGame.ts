import { SendAnswerArgs } from '@query-hooks/game/useSendAnswer';
import { SetSelectedFlag } from '@store/useGameStore';
import { IncorrectAnswer } from 'src/type-defs/game';
import { NavigateFunction } from 'react-router-dom';

export type OnlineGameArgs = {
  gameId: string | undefined;
  username: string | undefined;
  player: string | undefined;
  setCorrectAnswer: SetSelectedFlag;
  setIncorrectAnswer: (incorrectAnswer: IncorrectAnswer) => void;
  resetState: () => void;
  sendAnswer: (args: SendAnswerArgs) => void;
  sendPlayAgain: () => void;
  sendQuitGame: () => void;
};

export class OnlineGame {
  setCorrectAnswer;
  setIncorrectAnswer;
  resetState;
  gameId;
  sendAnswer;
  sendPlayAgain;
  sendQuitGame;
  socket: WebSocket;
  constructor(args: OnlineGameArgs) {
    this.socket = new WebSocket(
      `${import.meta.env.VITE_API_URL}/ws/game/${args.gameId}/${args.username}`
    );
    this.setCorrectAnswer = args.setCorrectAnswer;
    this.setIncorrectAnswer = args.setIncorrectAnswer;
    this.resetState = args.resetState;
    this.sendAnswer = args.sendAnswer;
    this.sendPlayAgain = args.sendPlayAgain;
    this.sendQuitGame = args.sendQuitGame;
    this.quitGame = this.quitGame.bind(this);
    this.playAgain = this.playAgain.bind(this);
    this.gameId = args.gameId;
  }

  handleAnswer(
    cb: () => void,
    player: number,
    flagIso: string,
    name: string,
    selectedSquareIndex: number[],
    isCorrect: boolean
  ) {
    this.sendAnswer({
      player,
      isCorrect,
      flagIso,
      name,
      selectedSquareIndex
    });

    cb();
  }

  handleCorrectAnswer(player: number, { name, iso_2 }: Flag, cell: Cell) {
    this.setCorrectAnswer(player, { name, iso_2 }, cell);
  }

  handleIncorrectAnswer(player: number, flag: Flag, cell: Cell) {
    this.setIncorrectAnswer({ player, flag, cell });
  }

  async quitGame(navigate: NavigateFunction, type: string) {
    if (type !== 'full-game') {
      await this.sendQuitGame();
    }
    this.socket?.close();
    this.resetState();
    navigate('/');
  }

  playAgain() {
    this.sendPlayAgain();
  }
}
