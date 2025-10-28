import { useEffect, useRef, useState, useMemo } from 'react';
import Modal from 'react-modal';
import { ShareModal } from 'components/Elements';

import { useQuoteState, useQuoteLoader, useQuoteActions, useQuoteEvents } from './hooks';
import { AuthorInfo, AuthorInfoLegacy } from './components';

import './scss/index.scss';

/**
 * Quote component - Displays quotes from various sources
 * Supports: API quotes, custom quotes, quote packs, and offline quotes
 */
export default function Quote() {
  const { quoteData, uiState, updateQuote, toggleShareModal } = useQuoteState();
  const { getQuote } = useQuoteLoader(updateQuote);
  const { copyQuote, toggleFavourite } = useQuoteActions(quoteData);

  const quoteRef = useRef(null);
  const [isFavourited, setIsFavourited] = useState(false);

  const settings = useMemo(() => ({
    authorDetails: localStorage.getItem('authorDetails') === 'true',
    isLegacyStyle: localStorage.getItem('widgetStyle') === 'legacy',
    isEnabled: localStorage.getItem('quote') !== 'false',
    zoom: Number((localStorage.getItem('zoomQuote') || 100) / 100),
  }), []);

  const setZoom = () => {
    if (quoteRef.current) {
      quoteRef.current.style.fontSize = `${0.8 * settings.zoom}em`;
    }
  };

  const handleFavourite = () => {
    toggleFavourite();
    setIsFavourited(!isFavourited);
  };

  useQuoteEvents(getQuote, setZoom);

  useEffect(() => {
    const shouldRefresh = localStorage.getItem('quotechange') === 'refresh' || 
                         localStorage.getItem('quotechange') === null;
    
    if (shouldRefresh) {
      setZoom();
      getQuote();
      localStorage.setItem('quoteStartTime', Date.now());
    }
  }, [getQuote]);

  useEffect(() => {
    setIsFavourited(!!localStorage.getItem('favouriteQuote'));
  }, [quoteData.quote]);

  if (quoteData.noQuote || !settings.isEnabled) {
    return null;
  }

  return (
    <div className="quotediv">
      <Modal
        closeTimeoutMS={300}
        isOpen={uiState.shareModal}
        className="Modal mainModal"
        overlayClassName="Overlay"
        ariaHideApp={false}
        onRequestClose={() => toggleShareModal(false)}
      >
        <ShareModal
          data={`${quoteData.quote} - ${quoteData.author}`}
          modalClose={() => toggleShareModal(false)}
        />
      </Modal>

      <span className="quote" ref={quoteRef}>
        {quoteData.quote}
      </span>

      {settings.authorDetails && (
        settings.isLegacyStyle ? (
          <AuthorInfoLegacy
            author={quoteData.author}
            authorlink={quoteData.authorlink}
            onCopy={copyQuote}
            onFavourite={handleFavourite}
            onShare={() => toggleShareModal(true)}
            isFavourited={isFavourited}
          />
        ) : (
          <AuthorInfo
            author={quoteData.author}
            authorOccupation={quoteData.authorOccupation}
            authorlink={quoteData.authorlink}
            authorimg={quoteData.authorimg}
            authorimglicense={quoteData.authorimglicense}
            onCopy={copyQuote}
            onFavourite={handleFavourite}
            onShare={() => toggleShareModal(true)}
            isFavourited={isFavourited}
          />
        )
      )}
    </div>
  );
}

export { Quote };
