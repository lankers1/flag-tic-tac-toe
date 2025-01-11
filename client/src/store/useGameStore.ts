import { create } from 'zustand';
import { evaluateBoardForWinner } from '../utils/game-ai/minmax';

export type SetSelectedFlag = (
  player: number,
  flag: { name: string; iso_2: string },
  cell: { row: number; col: number }
) => void;

interface GameState {
  turn: number;
  currentTurn: number;
  moveCounter: number;
  winner: number | null;
  selectedFlags: SelectedFlags;
  resetState: () => void;
  setCorrectAnswer: SetSelectedFlag;
  setTurn: (turn: number) => void;
  incorrectAnswer: IncorrectAnswer | null;
  setIncorrectAnswer: (incorrectAnswer: IncorrectAnswer) => void;
  winnerDirection: null | { from: [number, number]; to: [number, number] };
}

function setSelectedFlags(selectedFlags: SelectedFlags, state: GameState) {
  const winnerDirection = evaluateBoardForWinner(
    selectedFlags.map((arr) => arr.map((r) => r?.playersTurn || null))
  );

  if (winnerDirection) {
    return {
      selectedFlags,
      winner: state.currentTurn,
      winnerDirection
    };
  }

  return { selectedFlags, incorrectAnswer: null };
}

const initialState = {
  turn: 1,
  currentTurn: 1,
  moveCounter: 0,
  incorrectAnswer: null,
  winnerDirection: null,
  selectedFlags: [
    [...Array(3).fill(null, 0)],
    [...Array(3).fill(null, 0)],
    [...Array(3).fill(null, 0)]
  ],
  winner: null
};

export const useGameStore = create<GameState>((set) => ({
  ...initialState,
  setIncorrectAnswer: (incorrectAnswer: IncorrectAnswer) => {
    return set((state) => ({
      incorrectAnswer,
      currentTurn: state.currentTurn === 1 ? 2 : 1
    }));
  },
  setCorrectAnswer: (player, { name, iso_2 }, { row, col }) =>
    set((state) => {
      const f = state.selectedFlags.map((outerArr, outerIndex) => {
        return outerArr.map((innerArray, index) => {
          if (outerIndex === row && index === col) {
            return {
              name,
              iso_2,
              playersTurn: player
            };
          }
          return innerArray;
        });
      });
      const flags = setSelectedFlags(f, state);

      return {
        ...flags,
        currentTurn: state.currentTurn === 1 ? 2 : 1
      };
    }),
  setTurn: (turn: number) => set({ turn }),
  resetState: () => set(initialState)
}));
