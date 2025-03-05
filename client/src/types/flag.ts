export type SelectedFlags = (null | SelectedFlag)[][];

export type SelectedFlag = Flag & {
  playersTurn: number;
};
