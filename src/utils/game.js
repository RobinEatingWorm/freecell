import { createInitialBoard } from './board.js';

export const createInitialGame = () => ({
  board: createInitialBoard(),
  ...noGameMove(),
  moveHistory: []
});

export const resetGameMove = game => ({
  board: { ...game.board },
  ...noGameMove(),
  moveHistory: [...game.moveHistory]
});

const noGameMove = () => ({
  clickFirst: false,
  clientPosition: null,
  move: {
    from: null,
    to: null
  }
});
