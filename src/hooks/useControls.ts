import { Dispatch, useCallback, useEffect } from 'react';
import { Action } from './useTetrisBoard';

interface Props {
  isPlaying: boolean;
  dispatchBoardState: Dispatch<Action>;
  setTickSpeed: (speed: number) => void;
}

enum TickSpeed {
  Normal = 800,
  Sliding = 100,
  Fast = 50,
}

export function useControls({ isPlaying, dispatchBoardState, setTickSpeed }: Props) {
  const moveLeft = useCallback(() => {
    dispatchBoardState({ type: 'move', isPressingLeft: true });
  }, [dispatchBoardState]);

  const moveRight = useCallback(() => {
    dispatchBoardState({ type: 'move', isPressingRight: true });
  }, [dispatchBoardState]);

  const moveDown = useCallback(() => {
    setTickSpeed(TickSpeed.Fast);
  }, [setTickSpeed]);

  const stopMoveDown = useCallback(() => {
    setTickSpeed(TickSpeed.Normal);
  }, [setTickSpeed]);

  const rotate = useCallback(() => {
    dispatchBoardState({ type: 'move', isRotating: true });
  }, [dispatchBoardState]);

  useEffect(() => {
    if (!isPlaying) return;

    let isPressingLeft = false;
    let isPressingRight = false;
    let moveIntervalID: NodeJS.Timeout;

    const updateMovementInterval = () => {
      clearInterval(moveIntervalID);
      dispatchBoardState({ type: 'move', isPressingLeft, isPressingRight });
      moveIntervalID = setInterval(() => {
        dispatchBoardState({ type: 'move', isPressingLeft, isPressingRight });
      }, 300);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      switch (event.key) {
        case 'ArrowDown':
          setTickSpeed(TickSpeed.Fast);
          break;
        case 'ArrowUp':
          dispatchBoardState({ type: 'move', isRotating: true });
          break;
        case 'ArrowLeft':
          isPressingLeft = true;
          updateMovementInterval();
          break;
        case 'ArrowRight':
          isPressingRight = true;
          updateMovementInterval();
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          setTickSpeed(TickSpeed.Normal);
          break;
        case 'ArrowLeft':
          isPressingLeft = false;
          updateMovementInterval();
          break;
        case 'ArrowRight':
          isPressingRight = false;
          updateMovementInterval();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying, dispatchBoardState, setTickSpeed]);

  return {
    moveLeft,
    moveRight,
    moveDown,
    stopMoveDown,
    rotate,
  };
}
