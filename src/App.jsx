import { GameProvider } from './context/GameContext.jsx';
import Game from './pages/Game.jsx';

export default function App() {
  return (
    <div id="app">
      <main>
        <GameProvider>
          <Game />
        </GameProvider>
      </main>
    </div>
  );
}
