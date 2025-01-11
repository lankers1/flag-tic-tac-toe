import { EffectCallback, useEffect, useRef } from 'react';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import { SetSelectedFlag, useGameStore } from '../../store/useGameStore';

type Args = {
  gameId: string | undefined;
  player: string;
  setTurn: (turn: number) => void;
  setCorrectAnswer: SetSelectedFlag;
  setIncorrectAnswer: (incorrectAnswer: IncorrectAnswer) => void;
  resetState: () => void;
};

type Message = {
  playerTurn: number;
  isCorrect: boolean;
  type: string;
  name: string;
  flagIso: string;
  player: number;
  cell: { col: number; row: number };
};

export class OnlineGame {
  setCorrectAnswer;
  setIncorrectAnswer;
  setPlayerTurn;
  resetState;
  socket: WebSocket;
  constructor(args: Args) {
    this.socket = new WebSocket(
      `${import.meta.env.VITE_WEBSOCKET_PORT}/ws/game/${args.gameId}`
    );
    this.setPlayerTurn = args.setTurn;
    this.setCorrectAnswer = args.setCorrectAnswer;
    this.setIncorrectAnswer = args.setIncorrectAnswer;
    this.resetState = args.resetState;
    this.quitGame = this.quitGame.bind(this);
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
}

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
    _: string | undefined,
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

export const initGame = (args: Args) => {
  if (args.player === 'local' || args.player === 'computer') {
    return new LocalGame(args);
  }
  return new OnlineGame(args);
};

export let game: InstanceType<typeof OnlineGame | typeof LocalGame>;
// | InstanceType<typeof LocalGame>;

export function useOnMountUnsafe(effect: EffectCallback, dependencies: any[]) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      effect();
    }
  }, dependencies);
}

export const useInitGame = (opponentQuit: (arg: boolean) => void) => {
  const navigate = useNavigate();
  const { turn, setTurn, setCorrectAnswer, resetState, setIncorrectAnswer } =
    useGameStore((state) => state);
  const { gameId, player } = useParams();

  useOnMountUnsafe(() => {
    if (player) {
      game = initGame({
        gameId,
        player,
        setTurn,
        setCorrectAnswer,
        setIncorrectAnswer,
        resetState
      });
      if (game && player !== 'local' && player !== 'computer' && game?.socket) {
        game.socket.onmessage = (event: { data: string }) => {
          try {
            const message = JSON.parse(event?.data);
            handleWsMessage(message, opponentQuit);
          } catch (e) {
            console.error(e);
          }
        };
      }

      return () => {
        console.log('called 2');
        game.quitGame(navigate, gameId);
      };
    }
  }, [gameId, turn, player]);
};

function handleWsMessage(
  message: Message,
  opponentQuit: (arg: boolean) => void
) {
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
    case 'quit':
      return opponentQuit(true);
    default:
      return;
  }
}
