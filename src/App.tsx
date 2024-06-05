import Board from './components/Board.tsx';
import { EmptyCell } from './types.ts';

const board = Array(20)
  .fill(null)
  .map(() => Array(12).fill(EmptyCell.Empty));

function App() {
  return (
    <>
      <h1 className="text-center text-4xl">Retris</h1>
      <Board currentBoard={board} />
    </>
  );
}

export default App;
