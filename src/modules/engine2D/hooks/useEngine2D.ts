import { useEffect, useRef, useState } from 'react';
import Engine2D from '../Engine2D';

export function useEngine2D(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const [engine, setEngine] = useState<Engine2D | null>(null);
  const engineRef = useRef<Engine2D | null>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const newEngine = new Engine2D(canvasRef.current);
    engineRef.current = newEngine;
    setEngine(newEngine);
    
    newEngine.start();
    
    return () => {
      newEngine.stop();
      engineRef.current = null;
    };
  }, [canvasRef]);
  
  return engine;
}