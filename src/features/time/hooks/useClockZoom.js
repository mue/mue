import { useEffect, useRef } from 'react';
import defaults from '../options/default';

export const useClockZoom = () => {
  const elementRef = useRef(null);

  const updateZoom = () => {
    if (elementRef.current) {
      const zoomClock = localStorage.getItem('zoomClock') || defaults.zoomClock;
      elementRef.current.style.fontSize = `${4 * Number(zoomClock / 100)}em`;
    }
  };

  useEffect(() => {
    updateZoom();
  }, []);

  return { elementRef, updateZoom };
};
