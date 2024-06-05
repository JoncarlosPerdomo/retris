import { useTetrisBoard } from './useTetrisBoard.ts';
import { useCallback, useState } from 'react';
import { useInterval } from './useInterval.ts';
import { BoardShape } from '../types.ts';

enum TickSpeed {
  Normal = 800,
}

export function useTetris() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tickSpeed, setTickSpeed] = useState<TickSpeed | null>(null);

  const [{ board, droppingRow, droppingColumn, droppingBlock, droppingShape }, dispatchBoardState] = useTetrisBoard();

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setTickSpeed(TickSpeed.Normal);
    dispatchBoardState({ type: 'start' });
  }, [dispatchBoardState]);

  const gameTick = useCallback(() => {
    dispatchBoardState({ type: 'drop' });
  }, [dispatchBoardState]);

  useInterval(() => {
    if (!isPlaying) return;

    gameTick();
  }, tickSpeed);

  const renderedBoard = structuredClone(board) as BoardShape;

  if (isPlaying) {
    droppingShape
      .filter((row) => row.some((isSet) => isSet))
      .forEach((row: boolean[], rowIndex: number) => {
        row.forEach((isSet: boolean, colIndex: number) => {
          if (isSet) {
            renderedBoard[droppingRow + rowIndex][droppingColumn + colIndex] = droppingBlock;
          }
        });
      });
  }

  return {
    board: renderedBoard,
    startGame,
    isPlaying,
  };
}
