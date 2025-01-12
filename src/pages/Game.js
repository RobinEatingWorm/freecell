import Column from '../components/Column.js';
import Foundation from '../components/Foundation.js';
import FreeCell from '../components/FreeCell.js';
import { useGame, useGameDispatch } from '../context/GameContext.js';

export default function Game() {
  const game = useGame();
  const dispatch = useGameDispatch();
  return (
    <div
      id="game"
      onClick={event => dispatch({ type: "click-game", event })}
      onDragOver={event => event.preventDefault()}
    >
      <div id="top" className="flex-row">
        <div id="freecells" className="flex-row">
          {game.board.freecells.map((card, index) => (
            <FreeCell key={index} position={["freecell", index]} card={card} />
          ))}
        </div>
        <div id="foundations" className="flex-row">
          {game.board.foundations.map((card, index) => (
            <Foundation key={index} position={["foundation", index]} card={card} />
          ))}
        </div>
      </div>
      <div id="spacing-top-columns"></div>
      <div id="columns" className="flex-row">
        {game.board.columns.map((cards, index) => (
            <Column key={index} position={["column", index]} cards={cards} />
        ))}
      </div>
    </div>
  );
}
