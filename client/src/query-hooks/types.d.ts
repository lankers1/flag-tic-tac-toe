type Flag = {
  iso_2: string;
  name: string;
  characteristics: Characteristic[];
};

type Characteristic = { type: string; name: string };

type Cell = {
  row: number;
  col: number;
};

type Answers = Record<string, string[]>;
