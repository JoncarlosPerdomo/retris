import { useCallback, useState } from 'react';
import { Block, BlockShape, BoardShape } from '../types.ts';
import { useInterval } from './useInterval.ts';
import { getRandomBlock, hasCollisions, useTetrisBoard } from './useTetrisBoard.ts';

enum TickSpeed {
  Normal = 800,
  Sliding = 100,
}

export function useTetris() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [tickSpeed, setTickSpeed] = useState<TickSpeed | null>(null);
  const [upcomingBlocks, setUpcomingBlocks] = useState<Block[]>([]);

  const [{ board, droppingRow, droppingColumn, droppingBlock, droppingShape }, dispatchBoardState] = useTetrisBoard();

  const startGame = useCallback(() => {
    const startingBlocks = [getRandomBlock(), getRandomBlock(), getRandomBlock()];
    setUpcomingBlocks(startingBlocks);
    setIsPlaying(true);
    setTickSpeed(TickSpeed.Normal);
    dispatchBoardState({ type: 'start', newBlock: startingBlocks.pop() });
  }, [dispatchBoardState]);

  const commitPosition = useCallback(() => {
    if (!hasCollisions(board, droppingShape, droppingRow + 1, droppingColumn)) {
      setIsCommitting(false);
      setTickSpeed(TickSpeed.Normal);
      return;
    }

    const newBoard = structuredClone(board) as BoardShape;
    addShapeToBoard(newBoard, droppingBlock, droppingShape, droppingRow, droppingColumn);

    const newUpcomingBlocks = structuredClone(upcomingBlocks) as Block[];
    const newBlock = newUpcomingBlocks.pop() as Block;
    newUpcomingBlocks.unshift(getRandomBlock());

    setTickSpeed(TickSpeed.Normal);
    setUpcomingBlocks(newUpcomingBlocks);
    dispatchBoardState({ type: 'commit', newBoard, newBlock });
    setIsCommitting(false);
  }, [board, dispatchBoardState, droppingBlock, droppingShape, droppingRow, droppingColumn, upcomingBlocks]);

  const gameTick = useCallback(() => {
    if (isCommitting) {
      commitPosition();
    } else if (hasCollisions(board, droppingShape, droppingRow + 1, droppingColumn)) {
      setTickSpeed(TickSpeed.Sliding);
      setIsCommitting(true);
    } else {
      dispatchBoardState({ type: 'drop' });
    }
  }, [board, droppingShape, droppingRow, droppingColumn, dispatchBoardState, isCommitting, commitPosition]);

  useInterval(() => {
    if (!isPlaying) return;
    gameTick();
  }, tickSpeed);

  const renderedBoard = structuredClone(board) as BoardShape;

  if (isPlaying) {
    addShapeToBoard(renderedBoard, droppingBlock, droppingShape, droppingRow, droppingColumn);
  }

  function addShapeToBoard(
    board: BoardShape,
    droppingBlock: Block,
    droppingShape: BlockShape,
    droppingRow: number,
    droppingColumn: number,
  ) {
    droppingShape
      .filter((row) => row.some((isSet) => isSet))
      .forEach((row: boolean[], rowIndex: number) => {
        row.forEach((isSet: boolean, colIndex: number) => {
          if (isSet) {
            board[droppingRow + rowIndex][droppingColumn + colIndex] = droppingBlock;
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
