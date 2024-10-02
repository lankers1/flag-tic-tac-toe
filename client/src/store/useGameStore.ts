import { create } from "zustand";

interface GameState {
  playersTurn: number;
  moveCounter: number;
  winner: number | null;
  selectedFlags: SelectedFlags;
  togglePlayerTurn: () => void;
  setSelectedFlags: (selectedFlags: SelectedFlags) => void;
}

function equal(arr: (null | SelectedFlag)[]) {
  return (
    arr.every((r) => r?.isCorrect && r?.playersMove === 1) ||
    arr.every((r) => r?.isCorrect && r?.playersMove === 2)
  );
}

function completedDiagonal(selectedFlags: SelectedFlags) {
  return (
    equal([selectedFlags[0][0], selectedFlags[1][1], selectedFlags[2][2]]) ||
    equal([selectedFlags[0][2], selectedFlags[1][1], selectedFlags[2][0]])
  );
}

function completedVertical(selectedFlags: SelectedFlags) {
  return (
    equal([selectedFlags[0][0], selectedFlags[1][0], selectedFlags[2][0]]) ||
    equal([selectedFlags[0][1], selectedFlags[1][1], selectedFlags[2][1]]) ||
    equal([selectedFlags[0][2], selectedFlags[1][2], selectedFlags[2][2]])
  );
}

function completedHorizontal(selectedFlags: SelectedFlags) {
  return (
    equal(selectedFlags[0]) ||
    equal(selectedFlags[1]) ||
    equal(selectedFlags[2])
  );
}

function setSelectedFlags(selectedFlags: SelectedFlags) {
  if (
    completedDiagonal(selectedFlags) ||
    completedVertical(selectedFlags) ||
    completedHorizontal(selectedFlags)
  ) {
    return (state: GameState) => ({ selectedFlags, winner: state.playersTurn });
  }

  return () => ({ selectedFlags });
}

export const useGameStore = create<GameState>((set) => ({
  playersTurn: 1,
  moveCounter: 0,
  selectedFlags: [
    [...Array(3).fill(null, 0)],
    [...Array(3).fill(null, 0)],
    [...Array(3).fill(null, 0)],
  ],
  winner: null,
  togglePlayerTurn: () =>
    set((state) => ({ playersTurn: state.playersTurn === 1 ? 2 : 1 })),
  setSelectedFlags: (selectedFlags: SelectedFlags) =>
    set(setSelectedFlags(selectedFlags)),
}));
