import { N_SUITS } from '../constants/constants.js';

export const intToCard = int => ({ rank: Math.floor(int / N_SUITS) + 1, suit: int % N_SUITS });

export const formatColor = (suit, invert) => invert ? ['white', 'cyan'][suit % 2] : ['black', 'red'][suit % 2];
export const formatRank = rank => ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'][rank - 1];
export const formatSuit = suit => ['♠', '♥', '♣', '♦'][suit];

export const canStack = (card1, card2) => card1.rank === card2.rank + 1 && card1.suit % 2 !== card2.suit % 2;
export const getStackTop = cards => (
  cards.slice(0, -1)
  .map((card, index) => canStack(card, cards[index + 1]))
  .lastIndexOf(false) + 1
);
