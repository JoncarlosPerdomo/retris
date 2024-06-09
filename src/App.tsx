import { ThemeProvider } from '@/components/theme-provider';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Space } from 'lucide-react';
import Board from './components/Board.tsx';
import { ModeToggle } from './components/mode-toggle.tsx';
import { Button } from './components/ui/button.tsx';
import { useTetris } from './hooks/useTetris.ts';

function App() {
  const { board, startGame, isPlaying, score } = useTetris();

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-center text-4xl">Retris</h1>
        <Board currentBoard={board} />
        <div className="text-center">
          <p>Score: {score}</p>
          {!isPlaying && <Button onClick={startGame}>Start Game</Button>}
          <ModeToggle />
        </div>
        <div className="mt-4 flex items-center justify-center space-x-4">
          <Button variant="outline" size="icon">
            <Space />
          </Button>
          <div className="flex flex-col items-center space-y-2">
            <Button variant="outline" size="icon">
              <ChevronUp />
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon">
                <ChevronLeft />
              </Button>
              <Button variant="outline" size="icon">
                <ChevronDown />
              </Button>
              <Button variant="outline" size="icon">
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
