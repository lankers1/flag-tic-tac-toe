import { Flag } from './flag';

export type Board = {
  first_column: string;
  first_column_id: number;
  second_column: string;
  second_column_id: number;
  third_column: string;
  third_column_id: number;
  first_row: string;
  first_row_id: number;
  second_row: string;
  second_row_id: number;
  third_row: string;
  third_row_id: number;
};

export type Game = {
  board: Board;
  completed: boolean;
  playerOneId: string;
  playerTwoId: string;
};

export type Message = {
  playerTurn: number;
  isCorrect: boolean;
  type: string;
  name: string;
  flagIso: string;
  player: number;
  cell: { col: number; row: number };
  playAgain: boolean;
  gameId: string;
};

export type IncorrectAnswer = {
  player: number;
  cell: { row: number; col: number };
  flag: Flag;
};

export type Cell = {
  row: number;
  col: number;
};

export type Answers = Record<string, string[]>;
