const PLAYER = 1;
const AI = 2;

export function determineComputerMove(board: (number | null)[][]) {
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

function minimax(
  board: (number | null)[][],
  depth: number,
  isMaximizing: boolean
) {
  let score = evaluateBoardForWinner(board);

  if (score) return 10 + depth;
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

function isMovesLeft(board: (number | null)[][]) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === null) return true;
    }
  }
  return false;
}

export function evaluateBoardForWinner(board: (number | null)[][]) {
  for (let row = 0; row < 3; row++) {
    if (board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
      if (board[row][0] || board[row][0]) return true;
    }
  }

  for (let col = 0; col < 3; col++) {
    if (board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
      if (board[0][col] || board[0][col]) return true;
    }
  }

  if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    if (board[0][0]) return true;
  }
  if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    if (board[0][2]) return true;
  }

  return false;
}
