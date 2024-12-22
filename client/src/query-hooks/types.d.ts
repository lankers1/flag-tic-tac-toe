type Flag = {
  iso_2: string;
  name: string;
};

type Cell = {
  row: number;
  col: number;
};

type Game = {
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

type Answers = Record<string, string[]>;
