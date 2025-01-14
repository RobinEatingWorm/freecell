import { getFoundationSuiteIndex, sameMajorPosition } from './board.js'
import { canStack } from './card.js';

export function isValidMove(board, move) {
  // Validation checks on move
  if (move.from === null || move.to === null || sameMajorPosition(move.from, move.to)) {
    return false;
  }

  // Move board elements
  const boardFrom = board[move.from[0]][move.from[1]];
  const boardTo = board[move.to[0]][move.to[1]];

  // Validation checks on card
  const card = move.from[0] === "columns" ? boardFrom[move.from[2]] : boardFrom;
  if (card === null || card === undefined) {
    return false;
  }

  // Stack length
  const stackLength = move.from[0] === "columns" ? boardFrom.length - move.from[2] : 1;

  // Validation depending on end position
  switch (move.to[0]) {
    case "columns": {
      if (
        stackLength > freeSpace(board, move)
        || boardTo.length > 0 && !canStack(boardTo[boardTo.length - 1], card)
      ) {
        return false;
      }
      break;
    }
    case "foundations": {
      const foundationSuiteIndex = getFoundationSuiteIndex(board, card.suite);
      if (
        stackLength > 1
        || foundationSuiteIndex === -1 && card.rank !== 1
        || foundationSuiteIndex !== -1 && foundationSuiteIndex !== move.to[1]
        || card.rank === 1 && boardTo !== null
        || card.rank !== 1 && card.rank !== boardTo.rank + 1
      ) {
        return false;
      }
      break;
    }
    case "freecells": {
      if (stackLength > 1 || boardTo !== null) {
        return false;
      }
      break;
    }
    default: {
      return false;
    }
  }
  return true;
}

export function makeMove(board, from, to) {
  // Stack being moved
  const boardFrom = board[from[0]][from[1]];
  const stack = from[0] === "columns" ? boardFrom.slice(from[2]) : [{ ...boardFrom }];

  // Remove stack from start position
  switch (from[0]) {
    case "columns": {
      board.columns[from[1]] = board.columns[from[1]].slice(0, from[2]);
      break;
    }
    case "foundations": {
      board.foundations[from[1]].rank -= 1;
      if (board.foundations[from[1]].rank === 0) {
        board.foundations[from[1]] = null;
      }
      break;
    }
    case "freecells": {
      board.freecells[from[1]] = null;
      break;
    }
    default: {
      throw Error(`Unknown position: ${from[0]}`);
    }
  }

  // Add stack to end position
  switch (to[0]) {
    case "columns": {
      board.columns[to[1]] = board.columns[to[1]].concat(stack);
      break;
    }
    case "foundations": {
      board.foundations[to[1]] = stack[0];
      break;
    }
    case "freecells": {
      board.freecells[to[1]] = stack[0];
      break;
    }
    default: {
      throw Error(`Unknown position: ${to[0]}`);
    }
  }
  return { ...board };
}

const freeSpace = (board, move) => (
  (board.freecells.filter(freecell => freecell === null).length + 1)
  * (2 ** board.columns.filter((column, index) => column.length === 0 && index !== move.to[1]).length)
);
