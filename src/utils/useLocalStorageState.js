import { useState, useEffect } from 'react';

export const useLocalStorageState = (key, initialValue) => {
  const [state, setState] = useState(() => localStorage.getItem(key) || initialValue);

  useEffect(() => {
    localStorage.setItem(key, state);
  }, [key, state]);

  return [state, setState];
};