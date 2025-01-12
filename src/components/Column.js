import Card from './Card.js';
import { useGameDispatch } from '../context/GameContext.js';
import { getStackTop } from '../utils/card.js';

export default function Column({ position, cards }) {
  const dispatch = useGameDispatch();

  const movable = cards.map((card, index) => index >= getStackTop(cards));

  return (
    <div
      className="column"
      onClick={event => {
        // Prevent race conditions from unwanted event bubbling
        event.stopPropagation();
        dispatch({ type: "click-board", event, position });
      }}
      onDragOver={event => event.preventDefault()}
      onDrop={event => dispatch({ type: "drop", event, position })}
    >
      {cards ? cards.map((card, index) => (
        <Card
          key={index}
          position={[...position, index]}
          rank={card.rank}
          suite={card.suite}
          movable={movable[index]}
          overlap={index !== cards.length - 1}
        />
      )) : (
        <></>
      )}
    </div>
  );
}
