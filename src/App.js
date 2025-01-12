import './App.css';
import './styles/card.css'
import './styles/game.css'

import { GameProvider } from './context/GameContext.js';

import Game from './pages/Game.js';

function App() {
  return (
    <div className="App">
      {/*
      <header className="App-header">
      </header>
      */}
      <main>
        <GameProvider>
          <Game />
        </GameProvider>
      </main>
    </div>
  );
}

export default App;
