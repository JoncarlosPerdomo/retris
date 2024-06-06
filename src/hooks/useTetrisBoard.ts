import { Dispatch, useReducer } from 'react';
import { Block, BlockShape, BoardShape, EmptyCell, SHAPES } from '../types.ts';

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
  newBoard?: BoardShape;
  newBlock?: Block;
};

function boardReducer(state: BoardState, action: Action): BoardState {
  const newState = { ...state };

  switch (action.type) {
    case 'start':
      const firstBlock = action.newBlock || getRandomBlock();
      return {
        board: getEmptyBoard(),
        droppingRow: 0,
        droppingColumn: 3,
        droppingBlock: firstBlock,
        droppingShape: SHAPES[firstBlock].shape,
      };
    case 'drop':
      newState.droppingRow++;
      return newState;
    case 'commit':
      const newBlock = action.newBlock || getRandomBlock();
      return {
        board: action.newBoard || state.board,
        droppingRow: 0,
        droppingColumn: 3,
        droppingBlock: newBlock,
        droppingShape: SHAPES[newBlock].shape,
      };
    case 'move': {
      const newStateMove = { ...state };
      // Implement move logic here, then return updated state
      return newStateMove;
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export function hasCollisions(board: BoardShape, currentShape: BlockShape, row: number, column: number): boolean {
  let hasCollision = false;
  currentShape
    .filter((shapeRow) => shapeRow.some((isSet) => isSet))
    .forEach((shapeRow: boolean[], rowIndex: number) => {
      shapeRow.forEach((isSet: boolean, colIndex: number) => {
        if (
          isSet &&
          (row + rowIndex >= board.length ||
            column + colIndex >= board[0].length ||
            board[row + rowIndex][column + colIndex] !== EmptyCell.Empty)
        ) {
          hasCollision = true;
        }
      });
    });
  return hasCollision;
}
