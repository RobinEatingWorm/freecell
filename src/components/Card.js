import { useRef, useState } from 'react';

import { N_CARDS } from '../constants/constants.js';
import { formatColor, formatColorInverse, formatRank, formatSuite } from '../utils/card.js';

import { useGame, useGameDispatch } from '../context/GameContext.js';

export default function Card({ position, rank, suite, movable, overlap }) {
  // Use a ref to manipulate the DOM
  const cardRef = useRef(null);

  // Move and move dispatch context
  const game = useGame();
  const dispatch = useGameDispatch();

  // Save drag variables as state
  const [dragOffset, setDragOffset] = useState(null);
  const [dragSize, setDragSize] = useState(null);

  // Check whether the card is part of the current move
  const move = game.move.card !== null &&
    game.move.from[0] === position[0] &&
    game.move.from[1] === position[1] &&
    (position[0] === "column" ? position[2] >= game.move.from[2] : true);
  const click = move && game.clickFirst;
  const drag = move && game.clientPosition !== null;

  // Handle positioning when dragging
  if (drag && dragOffset === null) {
    const { height, width, x, y } = cardRef.current.getBoundingClientRect();
    setDragOffset({ x: game.clientPosition.x - x, y: game.clientPosition.y - y });
    setDragSize({ height: height, width: width });
  }

  // Reset positioning when not dragging
  if (!drag && dragOffset !== null) {
    setDragOffset(null);
    setDragSize(null);
  }

  // Card style
  const style = {
    backgroundColor: click ? "black" : "white",
    borderColor: click ? "gray" : "black",
    position: drag ? "absolute" : "relative",
    zIndex: (position[0] === "column" ? position[2] : 0) + (drag ? N_CARDS : 0),
    ...(drag && dragSize !== null && dragSize),
    ...(drag && dragOffset !== null && {
      left: game.clientPosition.x - dragOffset.x,
      top: game.clientPosition.y - dragOffset.y
    })
  };

  return (
    <div
      className={"card-frame card-space" + (overlap ? " card-overlap" : "")}
      ref={cardRef}
      style={style}
      onClick={movable ? event => {
        // Prevent race conditions from unwanted event bubbling
        event.stopPropagation();
        dispatch({ type: "click-card", event, cardRef, position, card: { rank, suite } });
      } : null}
      onDragStart={event => dispatch({ type: "drag-start", event, position, card: { rank, suite } })}
      onDrag={event => dispatch({ type: "drag", event, cardRef })}
      onDragEnd={event => dispatch({ type: "drag-end", event, cardRef })}
      draggable={movable}
    >
      <div style={{ color: click ? formatColorInverse(suite) : formatColor(suite) }}>
        <div className="card-header">
          <p className="card-header-text">{formatRank(rank)}</p>
          <p className="card-header-text">{formatSuite(suite)}</p>
        </div>
        <p className="card-body-text">{formatRank(rank)}</p>
      </div>
    </div>
  );
}
