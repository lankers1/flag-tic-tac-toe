type SelectedFlags = (null | SelectedFlag)[][];

type SelectedFlag = Flag & {
  playersMove: number;
};

type IncorrectAnswer = {
  player: number;
  flag: Flag;
  cell: { row: number; col: number };
};
