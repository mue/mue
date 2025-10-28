import { useState, useCallback } from 'react';

/**
 * Custom hook for managing quote state
 */
export function useQuoteState() {
  const [quoteData, setQuoteData] = useState({
    quote: null,
    author: null,
    authorOccupation: null,
    authorlink: null,
    authorimg: null,
    authorimglicense: null,
    quoteLanguage: '',
    noQuote: false,
  });

  const [uiState, setUiState] = useState({
    shareModal: false,
  });

  const updateQuote = useCallback((newData) => {
    setQuoteData((prev) => ({
      ...prev,
      ...newData,
    }));
  }, []);

  const toggleShareModal = useCallback((isOpen) => {
    setUiState((prev) => ({
      ...prev,
      shareModal: isOpen,
    }));
  }, []);

  return {
    quoteData,
    uiState,
    updateQuote,
    toggleShareModal,
  };
}
