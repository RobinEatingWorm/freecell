import { N_CARDS, N_COLUMNS, N_FOUNDATIONS, N_FREECELLS } from '../constants/constants.js';
import { intToCard } from './card.js';

export const createInitialBoard = () => ({
  columns: dealColumns(shuffleDeck()),
  foundations: Array(N_FOUNDATIONS).fill(null),
  freecells: Array(N_FREECELLS).fill(null)
});

export const getColumnLength = (board, index) => board.columns[index].length;
export const getFoundationSuitIndex = (board, suit) => board.foundations.map(card => card?.suit).indexOf(suit);
export const getFoundationSuitIndexAny = (board, suit) => (
  getFoundationSuitIndex(board, suit) === -1
  ? board.foundations.map(card => card?.suit).indexOf(undefined)
  : getFoundationSuitIndex(board, suit)
);

export const sameMajorPosition = (position1, position2) => (
  Array.from({ length: 2 }, (element, index) => position1[index] === position2[index])
  .every(element => element)
);

const dealColumns = deck => (
  Array.from({ length: N_COLUMNS }, (element, index) => deck.filter((card, order) => (order - index) % N_COLUMNS === 0))
);

const shuffleDeck = () => (
  Array.from({ length: N_CARDS }, (element, index) => ({ int: index, order: Math.random() }))
  .sort((a, b) => a.order - b.order)
  .map(element => intToCard(element.int))
);
