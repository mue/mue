import { useEffect } from 'react';
import EventBus from 'utils/eventbus';

/**
 * Custom hook for handling quote-related events
 */
export function useQuoteEvents(getQuote, setZoom) {
  useEffect(() => {
    const handleRefresh = (data) => {
      switch (data) {
        case 'quote':
          setZoom();
          break;
        case 'marketplacequoteuninstall':
        case 'quoterefresh':
          getQuote();
          break;
      }
    };

    EventBus.on('refresh', handleRefresh);
    return () => EventBus.off('refresh', handleRefresh);
  }, [getQuote, setZoom]);
}
