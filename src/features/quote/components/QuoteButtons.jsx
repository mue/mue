import { useState, useEffect } from 'react';
import { MdContentCopy, MdStarBorder, MdStar, MdIosShare } from 'react-icons/md';
import { Tooltip } from 'components/Elements';
import { useT } from 'contexts';
import variables from 'config/variables';
import EventBus from 'utils/eventbus';

/**
 * Quote action buttons component
 */
export default function QuoteButtons({ onCopy, onFavourite, onShare, isFavourited }) {
  const t = useT();
  const [showCopy, setShowCopy] = useState(localStorage.getItem('copyButton') !== 'false');
  const [showShare, setShowShare] = useState(localStorage.getItem('quoteShareButton') !== 'false');
  const [showFavourite, setShowFavourite] = useState(
    localStorage.getItem('favouriteQuoteEnabled') === 'true',
  );

  useEffect(() => {
    const handleRefresh = (data) => {
      if (data === 'quote') {
        setShowCopy(localStorage.getItem('copyButton') !== 'false');
        setShowShare(localStorage.getItem('quoteShareButton') !== 'false');
        setShowFavourite(localStorage.getItem('favouriteQuoteEnabled') === 'true');
      }
    };

    EventBus.on('refresh', handleRefresh);
    return () => {
      EventBus.off('refresh', handleRefresh);
    };
  }, []);

  return (
    <>
      {showCopy && (
        <Tooltip title={t('widgets.quote.copy')}>
          <button onClick={onCopy} aria-label={t('widgets.quote.copy')}>
            <MdContentCopy className="copyButton" />
          </button>
        </Tooltip>
      )}
      {showShare && (
        <Tooltip title={t('widgets.quote.share')}>
          <button onClick={onShare} aria-label={t('widgets.quote.share')}>
            <MdIosShare className="copyButton" />
          </button>
        </Tooltip>
      )}
      {showFavourite && (
        <Tooltip
          title={isFavourited ? t('widgets.quote.unfavourite') : t('widgets.quote.favourite')}
        >
          <button
            onClick={onFavourite}
            aria-label={
              isFavourited ? t('widgets.quote.unfavourite') : t('widgets.quote.favourite')
            }
          >
            {isFavourited ? (
              <MdStar className="copyButton" />
            ) : (
              <MdStarBorder className="copyButton" />
            )}
          </button>
        </Tooltip>
      )}
    </>
  );
}
