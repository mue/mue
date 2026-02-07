import { useEffect, useRef, useState, useMemo } from 'react';
import Modal from 'react-modal';
import { MdInfoOutline } from 'react-icons/md';
import { ShareModal } from 'components/Elements';

import { useQuoteState, useQuoteLoader, useQuoteActions } from './hooks';
import { AuthorInfo, AuthorInfoLegacy } from './components';
import QuoteInfoModal from './components/QuoteInfoModal';
import EventBus from 'utils/eventbus';
import { useFrequencyInterval } from '../../hooks/useFrequencyInterval';

import './scss/index.scss';

/**
 * Quote component - Displays quotes from various sources
 * Supports: API quotes, custom quotes, quote packs, and offline quotes
 */
export default function Quote() {
  const { quoteData, uiState, updateQuote, toggleShareModal, toggleInfoModal } = useQuoteState();
  const { getQuote } = useQuoteLoader(updateQuote);
  const { copyQuote, toggleFavourite } = useQuoteActions(quoteData);

  const quoteRef = useRef(null);
  const [localIsFavourited, setLocalIsFavourited] = useState(false);
  const [display, setDisplay] = useState('block');
  const [fontSize, setFontSize] = useState(() => {
    const zoomQuote = localStorage.getItem('zoomQuote');
    return `${1.2 * Number((zoomQuote || 100) / 100)}em`;
  });
  const [authorDetails, setAuthorDetails] = useState(
    localStorage.getItem('authorDetails') === 'true',
  );
  const [legacyStyle, setLegacyStyle] = useState(localStorage.getItem('widgetStyle') === 'legacy');

  const isFavourited = useMemo(() => {
    const favQuote = localStorage.getItem('favouriteQuote');
    return !!favQuote && favQuote === `${quoteData.quote} - ${quoteData.author}`;
  }, [quoteData.quote, quoteData.author]);

  const handleFavourite = () => {
    toggleFavourite();
    setLocalIsFavourited(!localIsFavourited);
  };

  useFrequencyInterval('quote', getQuote);

  useEffect(() => {
    const handleRefresh = (data) => {
      if (data === 'quote') {
        const quoteSetting = localStorage.getItem('quote');
        const zoomQuote = localStorage.getItem('zoomQuote');
        const authorDetailsSetting = localStorage.getItem('authorDetails');
        const widgetStyle = localStorage.getItem('widgetStyle');

        setDisplay(quoteSetting === 'false' ? 'none' : 'block');
        setFontSize(`${1.2 * Number((zoomQuote || 100) / 100)}em`);
        setAuthorDetails(authorDetailsSetting === 'true');
        setLegacyStyle(widgetStyle === 'legacy');
      } else if (
        data === 'marketplacequoteuninstall' ||
        data === 'quoterefresh' ||
        data === 'language' ||
        data === 'other' ||
        data === 'welcomeLanguage'
      ) {
        localStorage.removeItem('quoteQueue');
        localStorage.removeItem('currentQuote');
        getQuote();
      }
    };

    const shouldRefresh =
      localStorage.getItem('quotechange') === 'refresh' ||
      localStorage.getItem('quotechange') === null;

    if (shouldRefresh) {
      getQuote();
      localStorage.setItem('quoteStartTime', Date.now());
    }

    EventBus.on('refresh', handleRefresh);
    return () => {
      EventBus.off('refresh', handleRefresh);
    };
  }, [getQuote]);

  if (quoteData.noQuote) {
    return null;
  }

  return (
    <div className={`quotediv ${display === 'none' ? 'hidden' : ''}`} style={{ fontSize }}>
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

      <Modal
        closeTimeoutMS={300}
        isOpen={uiState.infoModal}
        className="Modal mainModal"
        overlayClassName="Overlay"
        ariaHideApp={false}
        onRequestClose={() => toggleInfoModal(false)}
      >
        <QuoteInfoModal quoteData={quoteData} modalClose={() => toggleInfoModal(false)} />
      </Modal>

      <span className="quote" ref={quoteRef}>
        {quoteData.quote}
      </span>

      {authorDetails &&
        quoteData.author &&
        (legacyStyle ? (
          <AuthorInfoLegacy
            author={quoteData.author}
            authorlink={quoteData.authorlink}
            onCopy={copyQuote}
            onFavourite={handleFavourite}
            onShare={() => toggleShareModal(true)}
            onInfo={() => toggleInfoModal(true)}
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
            onInfo={() => toggleInfoModal(true)}
            isFavourited={isFavourited}
          />
        ))}

      <div className="quote-info-text" onClick={() => toggleInfoModal(true)}>
        <MdInfoOutline />
        <span>About this quote</span>
      </div>
    </div>
  );
}

export { Quote };
