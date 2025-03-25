export type SelectedFlags = (null | SelectedFlag)[][];

export type SelectedFlag = Flag & {
  playersTurn: number;
};

export type Characteristic = { type: string; name: string };

export type Flag = {
  iso_2: string;
  name: string;
  characteristics: Characteristic[];
};
