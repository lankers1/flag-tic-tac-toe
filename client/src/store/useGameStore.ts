import { create } from "zustand";

export const useGameStore = create((set) => ({
  playersTurn: 1,
  moveCounter: 0,
  isComplete: false,
  togglePlayerTurn: () =>
    set((state) => ({ playersTurn: state.playersTurn === 1 ? 2 : 1 })),
}));
