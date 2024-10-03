type SelectedFlags = (null | SelectedFlag)[][];

type SelectedFlag = Flag & {
  playersMove: number;
};

type IncorrectAnswer = Flag & {
  player: number;
  cell: { row: number; col: number };
};
