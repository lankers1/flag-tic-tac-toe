import { create } from "zustand";

interface GameState {
  playersTurn: number;
  moveCounter: number;
  winner: number | null;
  selectedFlags: SelectedFlags;
  togglePlayerTurn: () => void;
  setSelectedFlags: (selectedFlags: SelectedFlags) => void;
}

function evaluate(board) {
  for (let row = 0; row < 3; row++) {
    if (board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
      if (board[row][0] || board[row][0]) return true;
    }
  }

  for (let col = 0; col < 3; col++) {
    if (board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
      if (board[0][col] || board[0][col]) return true;
    }
  }

  if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    if (board[0][0]) return true;
  }
  if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    if (board[0][2]) return true;
  }

  return 0;
}

function setSelectedFlags(selectedFlags: SelectedFlags) {
  if (
    evaluate(selectedFlags.map((arr) => arr.map((r) => r?.playersMove || null)))
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
