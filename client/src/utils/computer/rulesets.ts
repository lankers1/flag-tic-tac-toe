import { answerMap } from '@components/Game/AnswerModalContent';
import { determineComputerMove } from '../game-ai/minmax';
import { Answers, IncorrectAnswer } from '@type-defs/game';
import { Flag, SelectedFlag, SelectedFlags } from '@type-defs/flag';

interface Args {
  flags: Flag[];
  answers: Answers;
  selectedFlags: SelectedFlags;
  setIncorrectAnswer: (incorrectAnswer: IncorrectAnswer) => void;
}

function randomNumber(multiplier: number) {
  return Math.floor(Math.random() * multiplier);
}

function getRandomFlags(flags: Flag[], answers: string[]) {
  const selectableFlags = flags?.filter(
    (flag) => !answers.map(atob).includes(flag.iso_2)
  );

  return new Array(answers.length - 1)
    .fill(null)
    .map(
      () => selectableFlags[Math.floor(Math.random() * selectableFlags.length)]
    );
}

function flagArray(
  flags: Flag[],
  selectedFlags: SelectedFlags,
  answers: string[]
) {
  return [
    ...flags
      ?.filter(
        (flag) =>
          !selectedFlags
            .flat()
            .map((f) => f?.iso_2)
            .includes(flag.iso_2)
      )
      .filter((flag) => answers.map(atob).includes(flag.iso_2)),
    ...getRandomFlags(flags, answers)
  ];
}

export function easyComputer({
  flags,
  selectedFlags,
  answers,
  setIncorrectAnswer
}: Args):
  | (SelectedFlag & { row: number; col: number; answerArr: string[] })
  | undefined {
  const { row, col } = determineComputerMove(
    selectedFlags.map((arr) => arr.map((r) => r?.playersTurn || null))
  );

  const answerKey = answerMap[row][col];
  const answerArr = answers[answerKey as keyof typeof answers];
  const flagSelection = flagArray(flags, selectedFlags, answerArr);
  const randomFlag = randomNumber(flagSelection.length - 1);
  const guess = answerArr.includes(flagSelection[randomFlag].iso_2);
  if (!guess) {
    setIncorrectAnswer({
      flag: flagSelection[randomFlag],
      player: 2,
      cell: { row, col }
    });
    return;
  }
  const { iso_2, name } = flagSelection[randomFlag];
  return { row, col, name, iso_2, answerArr, playersTurn: 2 };
}

export function determineMove(
  rules: (
    args: Args
  ) =>
    | (SelectedFlag & { row: number; col: number; answerArr: string[] })
    | undefined,
  args: Args
) {
  return rules(args);
}
