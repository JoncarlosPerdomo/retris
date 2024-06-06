import Board from './components/Board.tsx';
import { useTetris } from './hooks/useTetris.ts';

function App() {
  const { board, startGame, isPlaying, score } = useTetris();

  return (
    <div className="grid grid-cols-3 gap-4">
      <h1 className="col-start-1 col-end-4 row-start-1 text-center text-4xl">Retris</h1>
      <Board currentBoard={board} />
      <div className="col-start-3 col-end-4 row-start-2 justify-center">
        <p className="text-center">Score: {score}</p>
        {isPlaying ? null : (
          <button onClick={startGame} className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
            Start Game
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
