import { useEffect, useRef } from 'react';
import type Engine2D from '../Engine2D';

export function useGameLoop(engine: Engine2D | null, callback: (deltaTime: number) => void, deps: any[] = []) {
  const callbackRef = useRef(callback);
  
  // Update callback ref when dependencies change
  useEffect(() => {
    callbackRef.current = callback;
  }, deps);
  
  useEffect(() => {
    if (!engine) return;
    
    const unsubscribe = engine.onUpdate((deltaTime) => {
      callbackRef.current(deltaTime);
    });
    
    return unsubscribe;
  }, [engine]);
}