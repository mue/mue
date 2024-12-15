import { useEffect, useRef } from 'react';

export const useTimeUpdate = (callback, interval = 1000) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    // Immediately execute callback to avoid delay
    savedCallback.current();

    const id = setInterval(() => {
      savedCallback.current();
    }, interval);

    return () => clearInterval(id);
  }, [interval]);
};
