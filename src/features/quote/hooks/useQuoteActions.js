import { useCallback } from 'react';
import { toast } from 'react-toastify';
import variables from 'config/variables';

/**
 * Custom hook for quote actions (copy, favourite, share)
 */
export function useQuoteActions(quoteData) {
  const copyQuote = useCallback(() => {
    variables.stats.postEvent('feature', 'Quote copied');
    navigator.clipboard.writeText(`${quoteData.quote} - ${quoteData.author}`);
    toast(variables.getMessage('toasts.quote'));
  }, [quoteData.quote, quoteData.author]);

  const toggleFavourite = useCallback(() => {
    if (localStorage.getItem('favouriteQuote')) {
      localStorage.removeItem('favouriteQuote');
    } else {
      localStorage.setItem('favouriteQuote', quoteData.quote + ' - ' + quoteData.author);
    }
    variables.stats.postEvent('feature', 'Quote favourite');
  }, [quoteData.quote, quoteData.author]);

  return {
    copyQuote,
    toggleFavourite,
  };
}
