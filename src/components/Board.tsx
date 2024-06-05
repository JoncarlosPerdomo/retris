import { BoardShape } from '../types.ts';
import Cell from './Cell.tsx';

interface Props {
  currentBoard: BoardShape;
}

function Board({ currentBoard }: Props) {
  return (
    <div className="m-auto w-fit select-none border-2 border-solid border-black">
      {currentBoard.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, cellIndex) => (
            <Cell key={`${rowIndex}-${cellIndex}`} type={cell} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;
