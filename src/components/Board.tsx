import { BoardShape } from '../types.ts';
import Cell from './Cell.tsx';

interface Props {
  currentBoard: BoardShape;
}

function Board({ currentBoard }: Props) {
  return (
    <div className="col-start-2 col-end-3 row-start-2 m-auto select-none border-2 border-solid border-black">
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
