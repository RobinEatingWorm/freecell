import Card from './Card.js';
import { useGameDispatch } from '../context/GameContext.js';

export default function Foundation({ position, card }) {
  const dispatch = useGameDispatch();
  return (
    <div
      className="foundation"
      onClick={event => {
        // Prevent race conditions from unwanted event bubbling
        event.stopPropagation();
        dispatch({ type: "click-board", event, position });
      }}
      onDragOver={event => event.preventDefault()}
      onDrop={event => dispatch({ type: "drop", event, position })}
    >
      <div className={"card-frame card-space top-border" + (card ? " top-occupied" : "")}></div>
      {card ? (
        <Card position={position} rank={card.rank} suite={card.suite} movable={false} overlap={false} />
      ) : (
        <></>
      )}
    </div>
  );
}
