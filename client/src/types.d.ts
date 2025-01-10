type SelectedFlags = (null | SelectedFlag)[][];

type SelectedFlag = Flag & {
  playersTurn: number;
};

type IncorrectAnswer = {
  player: number;
  cell: { row: number; col: number };
  flag: Flag;
};

type User = {
  favouriteFlag: string;
  email: string;
  username: string;
  password: string;
};
