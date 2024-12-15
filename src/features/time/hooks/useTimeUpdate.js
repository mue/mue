import { useEffect, useRef } from 'react';

export const useTimeUpdate = (updateFn) => {
  const timerRef = useRef(null);

  useEffect(() => {
    const startTime = (initialDelay = null) => {
      const showSeconds = localStorage.getItem('seconds') === 'true';
      const delay =
        initialDelay ?? (showSeconds ? 1000 - (Date.now() % 1000) : 60000 - (Date.now() % 60000));

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      updateFn();
      timerRef.current = setTimeout(() => startTime(), delay);
    };

    startTime(0);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [updateFn]);
};
