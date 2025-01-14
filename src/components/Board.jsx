import Column from '../components/Column.jsx';
import Foundation from '../components/Foundation.jsx';
import FreeCell from '../components/FreeCell.jsx';

import { useGame } from '../context/GameContext.jsx';

export default function Board() {
  const game = useGame();
  return (
    <div id="board" className="flex-column">
      <div id="board-top" className="flex-row">
        <div id="freecells" className="flex-row">
          {game.board.freecells.map((card, index) => (
            <FreeCell key={index} position={["freecells", index]} card={card} />
          ))}
        </div>
        <div id="foundations" className="flex-row">
          {game.board.foundations.map((card, index) => (
            <Foundation key={index} position={["foundations", index]} card={card} />
          ))}
        </div>
      </div>
      <div id="columns" className="flex-row">
        {game.board.columns.map((cards, index) => (
          <Column key={index} position={["columns", index]} cards={cards} />
        ))}
      </div>
    </div>
  );
}
