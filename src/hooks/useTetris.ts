import { useCallback, useEffect, useState } from 'react';
import { Block, BlockShape, BoardShape, EmptyCell } from '../types.ts';
import { useInterval } from './useInterval.ts';
import { getRandomBlock, hasCollisions, useTetrisBoard } from './useTetrisBoard.ts';

enum TickSpeed {
  Normal = 800,
  Sliding = 100,
  Fast = 50,
}

export function useTetris() {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [tickSpeed, setTickSpeed] = useState<TickSpeed | null>(null);
  const [upcomingBlocks, setUpcomingBlocks] = useState<Block[]>([]);

  const [{ board, droppingRow, droppingColumn, droppingBlock, droppingShape }, dispatchBoardState] = useTetrisBoard();

  const startGame = useCallback(() => {
    const startingBlocks = [getRandomBlock(), getRandomBlock(), getRandomBlock()];
    setUpcomingBlocks(startingBlocks);
    setIsPlaying(true);
    setScore(0);
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

    let numCleared = 0;
    for (let row = 20 - 1; row >= 0; row--) {
      if (newBoard[row].every((cell) => cell !== EmptyCell.Empty)) {
        numCleared++;
        newBoard.splice(row, 1);
      }
    }
    const newUpcomingBlocks = structuredClone(upcomingBlocks) as Block[];
    const newBlock = newUpcomingBlocks.pop() as Block;
    newUpcomingBlocks.unshift(getRandomBlock());

    setScore((prevScore) => prevScore + getPoints(numCleared));
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

  useEffect(() => {
    if (!isPlaying) return;

    let isPressingLeft = false;
    let isPressingRight = false;
    let moveIntervalID: number | undefined;

    const updateMovementInterval = () => {
      clearInterval(moveIntervalID);
      dispatchBoardState({ type: 'move', isPressingLeft, isPressingRight });
      moveIntervalID = setInterval(() => {
        dispatchBoardState({ type: 'move', isPressingLeft, isPressingRight });
      }, 300);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (event.key === 'ArrowDown') {
        setTickSpeed(TickSpeed.Fast);
      }

      if (event.key === 'ArrowUp') {
        dispatchBoardState({ type: 'move', isRotating: true });
      }

      if (event.key === 'ArrowLeft') {
        isPressingLeft = true;
        updateMovementInterval();
      }

      if (event.key === 'ArrowRight') {
        isPressingRight = true;
        updateMovementInterval();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        setTickSpeed(TickSpeed.Normal);
      }

      if (event.key === 'ArrowLeft') {
        isPressingLeft = false;
        updateMovementInterval();
      }

      if (event.key === 'ArrowRight') {
        isPressingRight = false;
        updateMovementInterval();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      setTickSpeed(TickSpeed.Normal);
    };
  }, [isPlaying]);

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
    score,
  };
}

function getPoints(numCleared: number): number {
  switch (numCleared) {
    case 0:
      return 0;
    case 1:
      return 100;
    case 2:
      return 300;
    case 3:
      return 500;
    case 4:
      return 800;
    default:
      throw new Error('Invalid number of rows cleared');
  }
}
