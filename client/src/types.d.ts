type SelectedFlags = (null | SelectedFlag)[][];

type SelectedFlag = Flag & {
  playersMove: number;
};
