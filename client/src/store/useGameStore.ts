import { create } from 'zustand';
import { evaluateBoardForWinner } from '../utils/game-ai/minmax';

interface GameState {
  turn: number;
  currentTurn: number;
  moveCounter: number;
  winner: number | null;
  selectedFlags: SelectedFlags;
  reset: () => void;
  setSelectedFlags: (
    player: number,
    flag: { name: string; iso_2: string },
    answerArr: string[],
    cell: { row: number; col: number }
  ) => void;
  setTurn: (turn: number) => void;
  incorrectAnswer: IncorrectAnswer | null;
  setIncorrectAnswer: (incorrectAnswer: IncorrectAnswer) => void;
  winnerDirection: null | { from: [number, number]; direction: string };
}

function setSelectedFlags(selectedFlags: SelectedFlags) {
  const winnerDirection = evaluateBoardForWinner(
    selectedFlags.map((arr) => arr.map((r) => r?.playersMove || null))
  );

  if (winnerDirection) {
    return (state: GameState) => ({
      selectedFlags,
      winner: state.currentTurn,
      winnerDirection
    });
  }

  return { selectedFlags, incorrectAnswer: null };
}

const initialState = {
  turn: 0,
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
  setSelectedFlags: (player, { name, iso_2 }, answerArr, { row, col }) =>
    set((state) => {
      const f = state.selectedFlags.map((outerArr, outerIndex) => {
        return outerArr.map((innerArray, index) => {
          if (outerIndex === row && index === col) {
            return answerArr.includes(iso_2)
              ? {
                  name,
                  iso_2,
                  playersMove: player
                }
              : null;
          }
          return innerArray;
        });
      });
      const flags = setSelectedFlags(f);
      return { ...flags, currentTurn: state.currentTurn === 1 ? 2 : 1 };
    }),
  setTurn: (turn: number) => set({ turn }),
  reset: () => set(initialState)
}));
