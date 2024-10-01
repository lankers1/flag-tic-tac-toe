type SelectedFlags = (null | SelectedFlag)[][];

type SelectedFlag = Flag & {
  isCorrect: boolean;
  playersMove: number;
};
