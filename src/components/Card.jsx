import { useRef, useState } from 'react';

import { N_CARDS } from '../constants/constants.js';
import { useGame, useGameDispatch } from '../context/GameContext.jsx';
import { formatColor, formatRank, formatSuite } from '../utils/card.js';
import { sameMajorPosition } from '../utils/board.js';

export default function Card({ position, rank, suite, movable, overlap }) {
  // Drag positioning state
  const [dragOffset, setDragOffset] = useState(null);
  const [dragSize, setDragSize] = useState(null);

  // Game and game dispatch context
  const game = useGame();
  const dispatch = useGameDispatch();

  // Ref for manipulating DOM
  const cardRef = useRef(null);

  // Check whether card is part of current move
  const move = (
    game.move.from !== null
    && sameMajorPosition(position, game.move.from)
    && (position[0] === "columns" ? position[2] >= game.move.from[2] : true)
  );
  const click = move && game.clickFirst;
  const drag = move && game.clientPosition !== null;

  // Handle positioning when dragging starts
  if (drag && dragOffset === null) {
    const { height, width, x, y } = cardRef.current.getBoundingClientRect();
    setDragOffset({ x: game.clientPosition.x - x, y: game.clientPosition.y - y });
    setDragSize({ height: height, width: width });
  }

  // Reset positioning when dragging ends
  if (!drag && dragOffset !== null) {
    setDragOffset(null);
    setDragSize(null);
  }

  // Card style
  const style = {
    backgroundColor: click ? "black" : "white",
    borderColor: click ? "gray" : "black",
    color: formatColor(suite, click),
    position: drag ? "absolute" : "relative",
    zIndex: (position[0] === "columns" && position[2]) + (drag && N_CARDS),
    ...(drag && dragOffset !== null && {
      left: game.clientPosition.x - dragOffset.x,
      top: game.clientPosition.y - dragOffset.y
    }),
    ...(drag && dragSize !== null && dragSize)
  };

  // Return component
  return (
    <div
      className={`card${overlap ? " card-overlap" : ""}`}
      ref={cardRef}
      style={style}
      onClick={movable ? event => {
        // Stop propagation first to prevent race conditions
        event.stopPropagation();
        dispatch({ type: "click-card", event, position, card: { rank, suite } });
      } : null}
      onDragStart={event => dispatch({ type: "drag-start", event, position, card: { rank, suite } })}
      onDrag={event => dispatch({ type: "drag", event, cardRef })}
      onDragEnd={event => dispatch({ type: "drag-end", event, cardRef })}
      draggable={movable}
    >
      <div className="card-header flex-row">
        <p className="card-text card-text-header">{formatRank(rank)}</p>
        <p className="card-text card-text-header">{formatSuite(suite)}</p>
      </div>
      <p className="card-text card-text-body">{formatRank(rank)}</p>
    </div>
  );
}
