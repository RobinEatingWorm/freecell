import { N_RANKS } from '../constants/constants.js';
import { useGame, useGameDispatch } from '../context/GameContext.jsx';

export default function Control() {
  const game = useGame();
  const dispatch = useGameDispatch();
  const win = game.board.foundations.map(card => card?.rank).every(rank => rank === N_RANKS);
  return (
    <div id="control" className="flex-row">
      <div id="control-buttons" className="flex-row">
        <button
          type="button"
          className="control-button control-text"
          onClick={event => {
            // Stop propagation first to prevent race conditions
            event.stopPropagation();
            dispatch({ type: "control-new", event });
          }}
        >
          New<br />Game
        </button>
        <button
          type="button"
          className="control-button control-text"
          onClick={event => {
            // Stop propagation first to prevent race conditions
            event.stopPropagation();
            dispatch({ type: "control-reset", event });
          }}
        >
          Reset<br />Game
        </button>
        <button
          type="button"
          className="control-button control-text"
          onClick={event => {
            // Stop propagation first to prevent race conditions
            event.stopPropagation();
            dispatch({ type: "control-undo", event });
          }}
        >
          Undo<br />Move
        </button>
      </div>
      <div className="control-spacer"></div>
      {win &&
        <p id="control-message" className="control-text">You win!</p>
      }
    </div>
  );
}
