import { createContext, useContext, useReducer } from 'react';

import blankImage from '../assets/blank.png';
import { N_CARDS, N_COLUMNS, N_FOUNDATIONS, N_FREECELLS } from '../constants/constants.js';
import { canStack, idToCard } from '../utils/card.js';

const GameContext = createContext(null);

const GameDispatchContext = createContext(null);

export function GameProvider({ children }) {
  const [game, dispatch] = useReducer(gameReducer, createInitialGame());
  return (
    <GameContext.Provider value={game}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}

export function useGameDispatch() {
  return useContext(GameDispatchContext);
}

function gameReducer(game, action) {
  switch (action.type) {
    case "click-card": {
      // Get rid of existing drags
      game.clientPosition = null;

      // On the first click, select the card
      if (!game.clickFirst) {
        // Indicate that a card is selected
        game.clickFirst = true;

        // Set active card
        game.move.card = action.card;
        game.move.from = action.position;

        return { ...game };
      }

      // Set possible move to location
      game.move.to = action.position[0] === "column" ? action.position.slice(0, 2) : action.position;

      // Double clicking: play to foundation if possible
      if (game.move.from[0] === game.move.to[0] && game.move.from[1] === game.move.to[1]) {
        for (let i = 0; i < N_FOUNDATIONS; i++) {
          game.move.to = ["foundation", i];
          if (isValidMove(game.board, game.move)) {
            game.board = makeMove(game.board, game.move);
            break;
          }
        }
        return {
          board: game.board,
          clickFirst: false,
          clientPosition: null,
          move: {
            card: null,
            from: null,
            to: null
          }
        };
      }

      // If the move is valid, make it
      if (isValidMove(game.board, game.move)) {
        game.board = makeMove(game.board, game.move);
        return {
          board: game.board,
          clickFirst: false,
          clientPosition: null,
          move: {
            card: null,
            from: null,
            to: null
          }
        };
      }

      // Othwerise, set currently clicked card to active
      game.clickFirst = true;
      game.move.card = action.card;
      game.move.from = action.position;
      game.move.to = null;

      return { ...game };
    }
    case "click-board": {
      // Get rid of existing drags
      game.clientPosition = null;

      // Do nothing if no card was clicked beforehand
      if (!game.clickFirst) {
        return { ...game };
      }

      // Set possible move to location
      game.move.to = action.position[0] === "column" ? action.position.slice(0, 2) : action.position;

      // If the move is valid, make it
      if (isValidMove(game.board, game.move)) {
        game.board = makeMove(game.board, game.move);
      }

      return {
        board: game.board,
        clickFirst: false,
        clientPosition: null,
        move: {
          card: null,
          from: null,
          to: null
        }
      };
    }
    case "click-game": {
      return {
        board: game.board,
        clickFirst: false,
        clientPosition: null,
        move: {
          card: null,
          from: null,
          to: null
        }
      };
    }
    case "drag-start": {
      // Get rid of existing clicks
      game.clickFirst = false;

      // Hide drag image
      const blank = new Image();
      blank.src = blankImage;
      action.event.dataTransfer.setDragImage(blank, 0, 0);

      // Track client position
      game.clientPosition = { x: action.event.clientX, y: action.event.clientY };

      // Set active card
      game.move.card = action.card;
      game.move.from = action.position;

      return { ...game };
    }
    case "drag": {
      // Disable pointer events on the card 
      // This prevents the drop event from propagating to the card's original column
      action.cardRef.current.style.pointerEvents = "none";

      // Track client position
      game.clientPosition = { x: action.event.clientX, y: action.event.clientY };

      return { ...game };
    }
    case "drop": {
      action.event.preventDefault();
      game.move.to = action.position;
      return { ...game };
    }
    case "drag-end": {
      // Reset pointer events on the card
      action.cardRef.current.style.pointerEvents = "";
      
      console.debug("card: ", game.move.card, "\nfrom: ", game.move.from, "\nto: ", game.move.to);
      if (isValidMove(game.board, game.move)) {
        game.board = makeMove(game.board, game.move);
      }
      return {
        board: game.board,
        clickFirst: false,
        clientPosition: null,
        move: {
          card: null,
          from: null,
          to: null
        }
      };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

function createInitialGame() {
  const deck = Array.from({ length: N_CARDS }, (element, index) => ({ id: index, order: Math.random() }))
    .sort((a, b) => a.order - b.order)
    .map(element => idToCard(element.id));
  const initialGame = {
    board: {
      columns: Array.from({ length: N_COLUMNS }, (element, index) =>
        deck.filter((card, order) => (order - index) % N_COLUMNS === 0)),
      foundations: Array(N_FOUNDATIONS).fill(null),
      freecells: Array(N_FREECELLS).fill(null)
    },
    clickFirst: false,
    clientPosition: null,
    move: {
      card: null,
      from: null,
      to: null
    }
  };
  return initialGame;
}

const freeSpace = (board, move) => (
  (board.freecells.filter(freecell => freecell === null).length + 1) *
  (2 ** board.columns.filter((column, index) => column.length === 0 && index !== move.to[1]).length)
);

function isValidMove(board, move) {
  // The move is incomplete
  if (move.card === null || move.from === null || move.to === null) {
    return false;
  }

  // No move was made
  if (move.from[0] === move.to[0] && move.from[1] === move.to[1]) {
    return false;
  }

  // The card isn't in its initial position
  const fromCard = move.from[0] === "column" ? (
    board.columns[move.from[1]][move.from[2]]
  ) : board.freecells[move.from[1]];
  if (!fromCard || move.card.rank !== fromCard.rank || move.card.suite !== fromCard.suite) {
    return false;
  }
  const stackLength = move.from[0] === "column" ? board.columns[move.from[1]].length - move.from[2] : 1;
  console.debug("stackLength: ", stackLength);
  switch (move.to[0]) {
    case "column": {
      console.debug("freeSpace: ", freeSpace(board, move));
      if (stackLength > freeSpace(board, move)) {
        return false;
      }
      const toColumn = board.columns[move.to[1]];
      if (toColumn.length > 0 && !canStack(toColumn[toColumn.length - 1], move.card)) {
        return false;
      }
      return true;
    }
    case "foundation": {
      if (stackLength > 1) {
        return false;
      }
      const foundationSuites = board.foundations.map(card => card?.suite);
      const foundationSuiteIndex = foundationSuites.indexOf(move.card.suite);
      console.debug("foundationSuites: ", foundationSuites, "\nfoundationSuiteIndex: ", foundationSuiteIndex);

      // Wrong foundation for the suite since another one already exists
      if (foundationSuiteIndex !== -1 && foundationSuiteIndex !== move.to[1]) {
        return false;
      }

      // Can only move aces if no foundation for the suite exists yet
      if (foundationSuiteIndex === -1 && move.card.rank !== 1) {
        return false;
      }

      // Can't move aces over existing cards
      if (move.card.rank === 1 && board.foundations[move.to[1]] !== null) {
        return false;
      }

      // Rule for moving other cards
      if (move.card.rank !== 1 && move.card.rank !== board.foundations[foundationSuiteIndex].rank + 1) {
        return false;
      }
      return true;
    }
    case "freecell": {
      if (stackLength > 1) {
        return false;
      }
      if (board.freecells[move.to[1]] !== null) {
        return false;
      }
      return true;
    }
    default: {
      return false;
    }
  }
}

function makeMove(board, move) {
  const stack = move.from[0] === "column" ? board.columns[move.from[1]].slice(move.from[2]) : [move.card];
  switch (move.from[0]) {
    case "column": {
      board.columns[move.from[1]] = board.columns[move.from[1]].slice(0, move.from[2]);
      break;
    }
    case "freecell": {
      board.freecells[move.from[1]] = null;
      break;
    }
    default: {
      throw Error("Unknown position: ", move.from[0]);
    }
  }
  switch (move.to[0]) {
    case "column": {
      board.columns[move.to[1]] = board.columns[move.to[1]].concat(stack);
      break;
    }
    case "foundation": {
      board.foundations[move.to[1]] = stack[0];
      break
    }
    case "freecell": {
      board.freecells[move.to[1]] = stack[0];
      break;
    }
    default: {
      throw Error("Unknown position: ", move.to[0]);
    }
  }
  return { ...board };
}
