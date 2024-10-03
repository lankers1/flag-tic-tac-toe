import { create } from "zustand";
import { evaluateBoardForWinner } from "../utils/game-ai/minmax";

interface GameState {
  playersTurn: number;
  moveCounter: number;
  winner: number | null;
  selectedFlags: SelectedFlags;
  togglePlayerTurn: () => void;
  reset: () => void;
  setSelectedFlags: (selectedFlags: SelectedFlags) => void;
  incorrectAnswer: IncorrectAnswer | null;
  setIncorrectAnswer: (incorrectAnswer: IncorrectAnswer) => void;
}

function setSelectedFlags(selectedFlags: SelectedFlags) {
  if (
    evaluateBoardForWinner(
      selectedFlags.map((arr) => arr.map((r) => r?.playersMove || null))
    )
  ) {
    return (state: GameState) => ({ selectedFlags, winner: state.playersTurn });
  }

  return () => ({ selectedFlags, incorrectAnswer: null });
}

const initialState = {
  playersTurn: 1,
  moveCounter: 0,
  incorrectAnswer: null,
  selectedFlags: [
    [...Array(3).fill(null, 0)],
    [...Array(3).fill(null, 0)],
    [...Array(3).fill(null, 0)],
  ],
  winner: null,
};

export const useGameStore = create<GameState>((set) => ({
  ...initialState,
  setIncorrectAnswer: (incorrectAnswer: IncorrectAnswer) =>
    set({
      incorrectAnswer,
    }),
  togglePlayerTurn: () =>
    set((state) => ({ playersTurn: state.playersTurn === 1 ? 2 : 1 })),
  setSelectedFlags: (selectedFlags: SelectedFlags) =>
    set(setSelectedFlags(selectedFlags)),
  reset: () => set(initialState),
}));
