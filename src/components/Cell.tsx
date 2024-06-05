import { Block, CellOptions, EmptyCell } from '../types.ts';

interface Props {
  type: CellOptions;
}

const cellStyles: Record<CellOptions, string> = {
  [EmptyCell.Empty]: 'bg-gray-200', // Default or empty cell color
  [Block.I]: 'bg-cyan-500', // Color for Block I
  [Block.J]: 'bg-blue-500', // Color for Block J
  [Block.L]: 'bg-orange-500', // Color for Block L
  [Block.O]: 'bg-yellow-500', // Color for Block O
  [Block.S]: 'bg-green-500', // Color for Block S
  [Block.T]: 'bg-purple-500', // Color for Block T
  [Block.Z]: 'bg-red-500', // Color for Block Z
};

function Cell({ type }: Props) {
  return <div className={`aspect-square w-7 border-2 border-solid border-black ${cellStyles[type]}`}></div>;
}

export default Cell;
