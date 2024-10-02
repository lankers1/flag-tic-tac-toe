import { answerMap } from "../pages/Game/components/AnswerModalContent";

function randomNumber(multiplier) {
  return Math.floor(Math.random() * multiplier);
}

function getRandomFlags(flags, answerArr) {
  const selectableFlags = flags?.filter(
    (flag) => !answerArr.includes(flag.iso_2)
  );

  return new Array(answerArr.length - 1)
    .fill(null)
    .map(
      () => selectableFlags[Math.floor(Math.random() * selectableFlags.length)]
    );
}

function flagArray(flags, selectedFlags, answerArr) {
  return [
    ...flags
      ?.filter(
        (flag) =>
          !selectedFlags
            .flat()
            .map((f) => f?.iso_2)
            .includes(flag.iso_2)
      )
      .filter((flag) => answerArr.includes(flag.iso_2)),
    ...getRandomFlags(flags, answerArr),
  ];
}

export function easyComputer(spaces, flags, selectedFlags, answers) {
  const otherMoves = playGame(
    selectedFlags.map((arr) => arr.map((r) => r?.playersMove || null))
  );

  const answerKey = answerMap[otherMoves[0]][otherMoves[1]];
  const answerArr = answers[answerKey];
  const flagSelection = flagArray(flags, selectedFlags, answerArr);
  const randomFlag = randomNumber(flagSelection.length - 1);
  const guess = answerArr.includes(flagSelection[randomFlag].iso_2);

  return selectedFlags.map((arr, index) =>
    otherMoves[0] === index
      ? arr.map((item, idx) =>
          idx === otherMoves[1]
            ? guess
              ? {
                  ...flagSelection[randomFlag],
                  playersMove: 2,
                }
              : null
            : item
        )
      : arr
  );
}

export function mediumComputer(spaces, flags, selectedFlags, answers) {
  const indexes = randomNumber(spaces.length);
  const answerKey = answerMap[spaces[indexes][0]][spaces[indexes][1]];
  const answerArr = answers[answerKey];
  const flagSelection = flagArray(flags, answerArr);
  const randomFlag = randomNumber(flagSelection.length - 1);

  return selectedFlags.map((arr, index) =>
    spaces[indexes][0] === index
      ? arr.map((item, idx) =>
          idx === spaces[indexes][1]
            ? {
                ...flagSelection[randomFlag],
                playersMove: 2,
                isCorrect: answerArr.includes(flagSelection[randomFlag].iso_2),
              }
            : item
        )
      : arr
  );
}

export function hardComputer(spaces, flags) {
  return "";
}

export function determineMove(
  rules,
  freeSpace,
  flags,
  selectedFlags,
  answerArr
) {
  return rules(freeSpace, flags, selectedFlags, answerArr);
}

const PLAYER = 1;
const AI = 2;

function isMovesLeft(board) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === null) return true;
    }
  }
  return false;
}

function evaluate(board) {
  for (let row = 0; row < 3; row++) {
    if (board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
      if (board[row][0] === PLAYER) return -10;
      if (board[row][0] === AI) return 10;
    }
  }

  for (let col = 0; col < 3; col++) {
    if (board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
      if (board[0][col] === PLAYER) return -10;
      if (board[0][col] === AI) return 10;
    }
  }

  if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    if (board[0][0] === PLAYER) return -10;
    if (board[0][0] === AI) return 10;
  }
  if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    if (board[0][2] === PLAYER) return -10;
    if (board[0][2] === AI) return 10;
  }

  return 0;
}

function minimax(board, depth, isMaximizing) {
  let score = evaluate(board);

  if (score === 10) return score - depth;

  if (score === -10) return score + depth;

  if (!isMovesLeft(board)) return 0;

  if (isMaximizing) {
    let best = -Infinity;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === null) {
          board[i][j] = AI;

          best = Math.max(best, minimax(board, depth + 1, false));
          board[i][j] = null;
        }
      }
    }
    return best;
  } else {
    let best = Infinity;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === null) {
          board[i][j] = PLAYER;

          best = Math.min(best, minimax(board, depth + 1, true));
          board[i][j] = null;
        }
      }
    }
    return best;
  }
}

function findBestMove(board) {
  let bestVal = -Infinity;
  let bestMove = { row: -1, col: -1 };

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === null) {
        board[i][j] = AI;

        let moveVal = minimax(board, 0, false);
        board[i][j] = null;

        if (moveVal > bestVal) {
          bestMove.row = i;
          bestMove.col = j;
          bestVal = moveVal;
        }
      }
    }
  }

  return bestMove;
}

function playGame(board) {
  let bestMove = findBestMove(board);
  return [bestMove.row, bestMove.col];
}
