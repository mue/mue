import { MdContentCopy, MdStarBorder, MdStar, MdIosShare } from 'react-icons/md';
import { Tooltip } from 'components/Elements';
import variables from 'config/variables';

/**
 * Quote action buttons component
 */
export default function QuoteButtons({ 
  onCopy, 
  onFavourite, 
  onShare, 
  isFavourited,
}) {
  const showCopy = localStorage.getItem('copyButton') !== 'false';
  const showShare = localStorage.getItem('quoteShareButton') !== 'false';
  const showFavourite = localStorage.getItem('favouriteQuoteEnabled') === 'true';

  return (
    <>
      {showCopy && (
        <Tooltip title={variables.getMessage('widgets.quote.copy')}>
          <button
            onClick={onCopy}
            aria-label={variables.getMessage('widgets.quote.copy')}
          >
            <MdContentCopy className="copyButton" />
          </button>
        </Tooltip>
      )}
      {showShare && (
        <Tooltip title={variables.getMessage('widgets.quote.share')}>
          <button
            onClick={onShare}
            aria-label={variables.getMessage('widgets.quote.share')}
          >
            <MdIosShare className="copyButton" />
          </button>
        </Tooltip>
      )}
      {showFavourite && (
        <Tooltip 
          title={
            isFavourited
              ? variables.getMessage('widgets.quote.unfavourite')
              : variables.getMessage('widgets.quote.favourite')
          }
        >
          <button
            onClick={onFavourite}
            aria-label={
              isFavourited
                ? variables.getMessage('widgets.quote.unfavourite')
                : variables.getMessage('widgets.quote.favourite')
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
