import { ThemeProvider } from '@/components/theme-provider';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Space } from 'lucide-react';
import Board from './components/Board.tsx';
import { ModeToggle } from './components/mode-toggle.tsx';
import { Button } from './components/ui/button.tsx';
import { useTetris } from './hooks/useTetris.ts';

function App() {
  const { board, startGame, isPlaying, score, moveLeft, moveRight, moveDown, stopMoveDown, rotate } = useTetris();

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="gap- flex h-screen flex-col items-center">
        <div className="h-1/16 flex items-center justify-between p-4">
          <p>Score: {score}</p>
          {!isPlaying && <Button onClick={startGame}>Start Game</Button>}
          <ModeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Board currentBoard={board} />
        </div>
        <div className="h-4/16 flex items-center justify-around p-4">
          <Button variant="outline" size="icon">
            <Space />
          </Button>
          <div className="flex flex-col items-center space-y-2">
            <Button variant="outline" size="icon" onClick={rotate}>
              <ChevronUp />
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={moveLeft}>
                <ChevronLeft />
              </Button>
              <Button variant="outline" size="icon" onMouseDown={moveDown} onMouseUp={stopMoveDown}>
                <ChevronDown />
              </Button>
              <Button variant="outline" size="icon" onClick={moveRight}>
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
