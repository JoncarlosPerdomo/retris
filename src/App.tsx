import Board from './components/Board.tsx';
import { useTetris } from './hooks/useTetris.ts';

function App() {
  const { board, startGame, isPlaying } = useTetris();

  return (
    <>
      <h1 className="text-center text-4xl">Retris</h1>
      <Board currentBoard={board} />
      <div className="flex justify-center">
        {isPlaying ? null : (
          <button onClick={startGame} className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
            Start Game
          </button>
        )}
      </div>
    </>
  );
}

export default App;
