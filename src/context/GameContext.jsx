import { createContext, useContext, useReducer } from 'react';

import blank from '../assets/blank.png';
import { getColumnLength, getFoundationSuiteIndexAny, sameMajorPosition } from '../utils/board.js';
import { createInitialGame, resetGameMove } from '../utils/game.js';
import { isValidMove, makeMove } from '../utils/move.js';

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
      // Track card on first click
      if (!game.clickFirst) {
        game.move.from = action.position;
        game.clickFirst = true;
        break;
      }

      // Set end position on second click
      const boardFrom = game.board[game.move.from[0]][game.move.from[1]];
      const card = game.move.from[0] === "columns" ? boardFrom[game.move.from[2]] : boardFrom;
      game.move.to = (
        sameMajorPosition(game.move.from, action.position)
        ? ["foundations", getFoundationSuiteIndexAny(game.board, card.suite)]
        : action.position.slice(0, 2)
      );

      // Make move if valid
      if (isValidMove(game.board, game.move)) {
        if (game.move.to[0] === "columns") {
          game.move.to = [...game.move.to, getColumnLength(game.board, game.move.to[1])];
        }
        game.board = makeMove(game.board, game.move.from, game.move.to);
        game.moveHistory = [...game.moveHistory, { from: [...game.move.from], to: [...game.move.to] }];
        game = resetGameMove(game);
        break;
      }

      // Track card otherwise
      game = resetGameMove(game);
      game.move.from = action.position;
      game.clickFirst = true;
      break;
    }
    case "click-board": {
      // No cards clicked beforehand
      if (!game.clickFirst) {
        break;
      }

      // Make move if valid
      game.move.to = action.position;
      if (isValidMove(game.board, game.move)) {
        if (game.move.to[0] === "columns") {
          game.move.to = [...game.move.to, getColumnLength(game.board, game.move.to[1])];
        }
        game.board = makeMove(game.board, game.move.from, game.move.to);
        game.moveHistory = [...game.moveHistory, { from: [...game.move.from], to: [...game.move.to] }];
      }

      // Reset game move state
      game = resetGameMove(game);
      break;
    }
    case "click-game": {
      // Reset game move state
      game = resetGameMove(game);
      break;
    }
    case "drag-start": {
      // Get rid of existing moves
      game = resetGameMove(game);

      // Hide drag image
      const blankImage = new Image();
      blankImage.src = blank;
      action.event.dataTransfer.setDragImage(blankImage, 0, 0);

      // Track move and client position
      game.move.from = action.position;
      game.clientPosition = { x: action.event.clientX, y: action.event.clientY };
      break;
    }
    case "drag": {
      // Disable pointer events on card
      // Prevents drop event propagation to card's original parent
      action.cardRef.current.style.pointerEvents = "none";

      // Track client position
      game.clientPosition = { x: action.event.clientX, y: action.event.clientY };
      break;
    }
    case "drop": {
      // Prevent additional event processing
      // Required for drop zones
      action.event.preventDefault();

      // Track move
      game.move.to = action.position;
      break;
    }
    case "drag-end": {
      // Enable pointer events on card
      action.cardRef.current.style.pointerEvents = "";

      // Make move if valid
      if (isValidMove(game.board, game.move)) {
        if (game.move.to[0] === "columns") {
          game.move.to = [...game.move.to, getColumnLength(game.board, game.move.to[1])];
        }
        game.board = makeMove(game.board, game.move.from, game.move.to);
        game.moveHistory = [...game.moveHistory, { from: [...game.move.from], to: [...game.move.to] }];
      }

      // Reset game move state
      game = resetGameMove(game);
      break;
    }
    case "control-new": {
      // New game
      game = createInitialGame();
      break;
    }
    case "control-reset": {
      // Undo all moves
      while (game.moveHistory.length > 0) {
        const move = game.moveHistory.pop();
        game.board = makeMove(game.board, move.to, move.from);
      }

      // Reset game move state
      game = resetGameMove(game);
      break;
    }
    case "control-undo": {
      // Undo last move
      if (game.moveHistory.length > 0) {
        const move = game.moveHistory.pop();
        game.board = makeMove(game.board, move.to, move.from);
      }

      // Reset game move state
      game = resetGameMove(game);
      break;
    }
    default: {
      throw Error(`Unknown action: ${action.type}`);
    }
  }
  return { ...game };
}
