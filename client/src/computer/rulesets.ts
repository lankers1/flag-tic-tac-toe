import { answerMap } from "../pages/Game/components/AnswerModalContent";
import { determineComputerMove } from "../utils/game-ai/minmax";

interface Args {
  flags: Flag[];
  answers: Answers;
  selectedFlags: SelectedFlags;
  setIncorrectAnswers: (incorrectAnswer: IncorrectAnswer) => void;
}

function randomNumber(multiplier: number) {
  return Math.floor(Math.random() * multiplier);
}

function getRandomFlags(flags: Flag[], answers: string[]) {
  const selectableFlags = flags?.filter(
    (flag) => !answers.includes(flag.iso_2)
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
      .filter((flag) => answers.includes(flag.iso_2)),
    ...getRandomFlags(flags, answers),
  ];
}

export function easyComputer({
  flags,
  selectedFlags,
  answers,
  setIncorrectAnswers,
}: Args): SelectedFlags | undefined {
  const { row, col } = determineComputerMove(
    selectedFlags.map((arr) => arr.map((r) => r?.playersMove || null))
  );

  const answerKey = answerMap[row][col];
  const answerArr = answers[answerKey as keyof typeof answers];
  const flagSelection = flagArray(flags, selectedFlags, answerArr);
  const randomFlag = randomNumber(flagSelection.length - 1);
  const guess = answerArr.includes(flagSelection[randomFlag].iso_2);
  if (!guess) {
    setIncorrectAnswers({ ...flagSelection[randomFlag], player: 2 });
    return;
  }

  return selectedFlags.map((arr, index) =>
    row === index
      ? arr.map((item, idx) =>
          idx === col
            ? {
                ...flagSelection[randomFlag],
                playersMove: 2,
              }
            : item
        )
      : arr
  );
}

export function determineMove(
  rules: (args: Args) => SelectedFlags | undefined,
  args: Args
) {
  return rules(args);
}
