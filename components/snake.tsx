import React, { useState, useEffect, useCallback } from "react";

// Base size constants
const BASE_CELL_SIZE = 20;
const MIN_GRID_SIZE = 30;
const INITIAL_SNAKE = [{ x: 15, y: 15 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 150;

export const SnakeGame = ({ onClose }: { onClose: () => void }) => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 15, y: 10 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameLoop, setGameLoop] = useState<NodeJS.Timeout | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * MIN_GRID_SIZE),
      y: Math.floor(Math.random() * MIN_GRID_SIZE),
    };
    setFood(newFood);
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    generateFood();
  }, [generateFood]);

  const checkCollision = (head: { x: number; y: number }) => {
    if (
      head.x < 0 ||
      head.x >= MIN_GRID_SIZE ||
      head.y < 0 ||
      head.y >= MIN_GRID_SIZE
    ) {
      return true;
    }
    return snake.some(
      (segment) => segment.x === head.x && segment.y === head.y
    );
  };

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const head = {
        x: prevSnake[0].x + direction.x,
        y: prevSnake[0].y + direction.y,
      };

      if (checkCollision(head)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      if (head.x === food.x && head.y === food.y) {
        setScore((prev) => prev + 1);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, generateFood]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (key === "escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (!gameStarted && key === "p") {
        e.preventDefault();
        setGameStarted(true);
        return;
      }

      if (gameOver && key === "r") {
        e.preventDefault();
        resetGame();
        return;
      }

      const newDirection = {
        arrowup: { x: 0, y: -1 },
        arrowdown: { x: 0, y: 1 },
        arrowleft: { x: -1, y: 0 },
        arrowright: { x: 1, y: 0 },
      }[key];

      if (newDirection) {
        e.preventDefault();
        const isOpposite =
          newDirection.x === -direction.x && newDirection.y === -direction.y;

        if (!isOpposite) {
          setDirection(newDirection);
        }
      }
    },
    [direction, gameOver, gameStarted, onClose, resetGame]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!gameOver && gameStarted) {
      const interval = setInterval(moveSnake, GAME_SPEED);
      setGameLoop(interval);
      return () => clearInterval(interval);
    } else if (gameLoop) {
      clearInterval(gameLoop);
    }
  }, [gameOver, gameStarted, moveSnake]);

  // Calculate grid size based on window size and fullscreen state
  const calculateGameDimensions = () => {
    if (isFullscreen) {
      // Calculate the available space with padding
      const maxWidth = window.innerWidth - 200; // Increased padding
      const maxHeight = window.innerHeight - 200; // Increased padding
      
      // Calculate how many cells we can fit while maintaining square cells
      const horizontalCells = Math.floor(maxWidth / BASE_CELL_SIZE);
      const verticalCells = Math.floor(maxHeight / BASE_CELL_SIZE);
      
      // Use the smaller dimension to ensure a square grid
      const gridSize = Math.max(
        Math.min(horizontalCells, verticalCells),
        MIN_GRID_SIZE // Ensure we don't go smaller than minimum grid size
      );

      return { gridSize, cellSize: BASE_CELL_SIZE };
    }
    return { gridSize: MIN_GRID_SIZE, cellSize: BASE_CELL_SIZE };
  };

  const { gridSize, cellSize } = calculateGameDimensions();

  // Recalculate on window resize
  useEffect(() => {
    const handleResize = () => {
      const { gridSize } = calculateGameDimensions();
      // Update snake position if needed to keep it in bounds
      setSnake(prev => prev.map(segment => ({
        x: Math.min(segment.x, gridSize - 1),
        y: Math.min(segment.y, gridSize - 1)
      })));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isFullscreen]);

  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 w-48 h-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-lg cursor-pointer hover:scale-105 transition-all duration-200"
      >
        <div className="h-full flex items-center space-x-2 px-3">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="ml-2 text-xs text-gray-600 dark:text-gray-400 font-geist">Snake Game</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className={`flex flex-col bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 rounded-none' : 'max-h-[90vh] max-w-[90vw]'
      }`}>
        {/* Window Controls */}
        <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-800 p-3">
          <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer" onClick={onClose} />
          <div className="w-3 h-3 rounded-full bg-yellow-500 cursor-pointer" onClick={() => setIsMinimized(true)} />
          <div className="w-3 h-3 rounded-full bg-green-500 cursor-pointer" onClick={() => setIsFullscreen(!isFullscreen)} />
        </div>

        {/* Game Board and Score Container */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="flex flex-col">
            <div 
              className={`relative overflow-hidden ${isFullscreen ? 'border border-gray-200 dark:border-gray-800' : ''}`}
              style={{
                width: gridSize * cellSize,
                height: gridSize * cellSize,
              }}
            >
              {(!gameStarted || gameOver) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                  {!gameStarted && !gameOver && (
                    <>
                      <div className="text-gray-700 dark:text-gray-300 text-lg">
                        Press P to play
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 mt-2">
                        Use arrow keys to move
                      </div>
                    </>
                  )}
                  {gameOver && (
                    <>
                      <div className="text-gray-700 dark:text-gray-300 text-lg">
                        GAME OVER
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 mt-2">
                        Press R to restart
                      </div>
                    </>
                  )}
                </div>
              )}
              
              {gameStarted && (
                <>
                  {snake.map((segment, i) => (
                    <div
                      key={i}
                      className="absolute bg-purple-600"
                      style={{
                        width: cellSize - 1,
                        height: cellSize - 1,
                        left: segment.x * cellSize,
                        top: segment.y * cellSize,
                      }}
                    />
                  ))}
                  <div
                    className="absolute bg-black dark:bg-white"
                    style={{
                      width: cellSize - 1,
                      height: cellSize - 1,
                      left: food.x * cellSize,
                      top: food.y * cellSize,
                    }}
                  />
                </>
              )}
            </div>
            
            {/* Score - directly under game board */}
            <div className={`h-10 p-3 flex items-center font-mono text-sm text-gray-700 dark:text-gray-300 ${!isFullscreen ? 'border-t border-gray-200 dark:border-gray-800' : ''}`}>
              Score:{score}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;