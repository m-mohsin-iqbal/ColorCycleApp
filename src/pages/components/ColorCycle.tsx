import { useState, useEffect } from 'react';
import ColorHistory from './ColorHistory';
import { generateRandomColor } from '../utils';

interface ColorState {
  colors: string[];
  highlightIndex: number;
}

export default function ColorCycle() {
  const [colorState, setColorState] = useState<ColorState>({
    colors: Array.from({ length: 5 }, generateRandomColor),
    highlightIndex: 0,
  });
  const [showHistory, setShowHistory] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPaused) {
        setColorState((prevState) => {
          const newHighlightIndex = (prevState.highlightIndex + 1) % 5;
          const newColors = [...prevState.colors];
          if (newHighlightIndex === 0) {
            newColors[4] = generateRandomColor();
          } else {
            newColors[newHighlightIndex - 1] = generateRandomColor();
          }
          return {
            colors: newColors,
            highlightIndex: newHighlightIndex,
          };
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused]);

  useEffect(() => {
    const logColors = async () => {
      if (colorState.colors.some(color => color !== '')) {
        try {
          await fetch('/api/colors', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(colorState),
          });
        } catch (error) {
          console.error('Failed to log colors:', error);
        }
      }
    };

    logColors();
  }, [colorState]);

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="flex justify-center space-x-4">
        {colorState.colors.map((color, index) => (
          <div
            key={index}
            className={`w-20 h-20 border-2 ${index === colorState.highlightIndex ? 'border-yellow-400' : 'border-gray-300'} rounded-md transition-all duration-300`}
            style={{ backgroundColor: color || 'transparent' }}
          />
        ))}
      </div>
      <div className="flex space-x-4">
        <button
          onClick={togglePause}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button
          onClick={toggleHistory}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          {showHistory ? 'Hide Color History' : 'Show Color History'}
        </button>
      </div>

      {showHistory && (
        <div className="">
          <h2 className="text-2xl font-bold mb-4">Color History</h2>
          <ColorHistory />
        </div>
      )}
    </div>
  );
}