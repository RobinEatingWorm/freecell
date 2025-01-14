import { N_SUITES } from '../constants/constants.js';

export const intToCard = int => ({ rank: Math.floor(int / N_SUITES) + 1, suite: int % N_SUITES });

export const formatColor = (suite, invert) => invert ? ['white', 'cyan'][suite % 2] : ['black', 'red'][suite % 2];
export const formatRank = rank => ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'][rank - 1];
export const formatSuite = suite => ['♠', '♥', '♣', '♦'][suite];

export const canStack = (card1, card2) => card1.rank === card2.rank + 1 && card1.suite % 2 !== card2.suite % 2;
export const getStackTop = cards => (
  cards.slice(0, -1)
  .map((card, index) => canStack(card, cards[index + 1]))
  .lastIndexOf(false) + 1
);
