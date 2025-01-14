import Card from './Card.jsx';
import { useGameDispatch } from '../context/GameContext.jsx';

export default function FreeCell({ position, card }) {
  const dispatch = useGameDispatch();
  return (
    <div
      className="freecell"
      onClick={event => {
        // Stop propagation first to prevent race conditions
        event.stopPropagation();
        dispatch({ type: "click-board", event, position });
      }}
      onDragOver={event => event.preventDefault()}
      onDrop={event => {dispatch({ type: "drop", event, position })}}
    >
      <div className={`card card-frame${card ? " card-frame-occupied" : ""}`}></div>
      {card && (
        <Card position={position} rank={card.rank} suite={card.suite} movable={true} overlap={false} />
      )}
    </div>
  );
}
