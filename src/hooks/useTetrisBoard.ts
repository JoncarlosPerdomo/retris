import { Dispatch, useReducer } from 'react';
import { Block, BlockShape, BoardShape, EmptyCell, SHAPES } from '../types.ts';

const BOARD_HEIGHT = 20;
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

export type Action = {
  type: 'start' | 'drop' | 'commit' | 'move';
  newBoard?: BoardShape;
  newBlock?: Block;
  isPressingLeft?: boolean;
  isPressingRight?: boolean;
  isRotating?: boolean;
};

function rotateBlock(shape: BlockShape): BlockShape {
  const rows = shape.length;
  const cols = shape[0].length;

  const rotated = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(false));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      rotated[col][rows - row - 1] = shape[row][col];
    }
  }
  return rotated;
}

function boardReducer(state: BoardState, action: Action): BoardState {
  const newState = { ...state };
  const firstBlock = action.newBlock || getRandomBlock();
  const newBlock = action.newBlock || getRandomBlock();

  switch (action.type) {
    case 'start':
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
      return {
        board: [...getEmptyBoard(BOARD_HEIGHT - action.newBoard!.length), ...action.newBoard!],
        droppingRow: 0,
        droppingColumn: 3,
        droppingBlock: newBlock,
        droppingShape: SHAPES[newBlock].shape,
      };
    case 'move': {
      const rotatedShape = action.isRotating ? rotateBlock(state.droppingShape) : newState.droppingShape;
      let columnOffset = action.isPressingLeft ? -1 : 0;
      columnOffset = action.isPressingRight ? 1 : columnOffset;

      if (!hasCollisions(newState.board, rotatedShape, newState.droppingRow, newState.droppingColumn + columnOffset)) {
        newState.droppingColumn += columnOffset;
        newState.droppingShape = rotatedShape;
      }
      return newState;
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
