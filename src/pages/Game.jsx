import Board from '../components/Board.jsx'
import Control from '../components/Control.jsx';
import { useGameDispatch } from '../context/GameContext.jsx';
import '../styles/board.css';
import '../styles/card.css';
import '../styles/control.css';
import '../styles/game.css';

export default function Game() {
  const dispatch = useGameDispatch();
  return (
    <div
      id="game"
      className="flex-column"
      onClick={event => dispatch({ type: "click-game", event })}
      onDragOver={event => event.preventDefault()}
    >
      <Control />
      <Board />
    </div>
  );
}
