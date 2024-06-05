import { Block, BlockShape, BoardShape, EmptyCell, SHAPES } from '../types.ts';
import { Dispatch, useReducer } from 'react';

export type BoardState = {
  board: BoardShape;
  droppingRow: number;
  droppingColumn: number;
  droppingBlock: Block;
  droppingShape: BlockShape;
};

export function useTetrisBoard(): [BoardState, Dispatch<Action>] {
  const [boardState, dispatchBoardState] = useReducer(
    boardReducer,
    {
      board: [],
      droppingRow: 0,
      droppingColumn: 0,
      droppingBlock: Block.I,
      droppingShape: SHAPES.I.shape,
    },
    (emptyState) => {
      return {
        ...emptyState,
        board: getEmptyBoard(),
      };
    },
  );

  return [boardState, dispatchBoardState];
}

export function getEmptyBoard(height = 20): BoardShape {
  return Array(height)
    .fill(null)
    .map(() => Array(12).fill(EmptyCell.Empty));
}

export function getRandomBlock(): Block {
  const blocks = Object.values(Block);
  return blocks[Math.floor(Math.random() * blocks.length)];
}

type Action = {
  type: 'start' | 'drop' | 'commit' | 'move';
};

function boardReducer(state: BoardState, action: Action): BoardState {
  switch (action.type) {
    case 'start':
      const firstBlock = getRandomBlock();
      return {
        board: getEmptyBoard(),
        droppingRow: 0,
        droppingColumn: 3,
        droppingBlock: firstBlock,
        droppingShape: SHAPES[firstBlock].shape,
      };
    case 'drop':
      const newStateDrop = { ...state };
      newStateDrop.droppingRow++;
      return newStateDrop;
    case 'commit':
      return { ...state };
    case 'move':
      const newStateMove = { ...state };
      // Implement move logic here, then return updated state
      return newStateMove;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}
