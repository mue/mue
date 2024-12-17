import { MdContentCopy, MdStarBorder, MdStar, MdIosShare } from 'react-icons/md';
import variables from 'config/variables';
import { Tooltip } from 'components/Elements';

const QuoteButtons = ({ onCopy, onFavourite, onShare, isFavourited }) => {
  const buttons = {
    share: (
      <Tooltip title={variables.getMessage('widgets.quote.share')}>
        <button onClick={onShare} aria-label={variables.getMessage('widgets.quote.share')}>
          <MdIosShare className="copyButton" />
        </button>
      </Tooltip>
    ),
    copy: (
      <Tooltip title={variables.getMessage('widgets.quote.copy')}>
        <button onClick={onCopy} aria-label={variables.getMessage('widgets.quote.copy')}>
          <MdContentCopy className="copyButton" />
        </button>
      </Tooltip>
    ),
    favourite: isFavourited ? (
      <Tooltip title={variables.getMessage('widgets.quote.unfavourite')}>
        <button
          onClick={onFavourite}
          aria-label={variables.getMessage('widgets.quote.unfavourite')}
        >
          <MdStar className="copyButton" />
        </button>
      </Tooltip>
    ) : (
      <Tooltip title={variables.getMessage('widgets.quote.favourite')}>
        <button onClick={onFavourite} aria-label={variables.getMessage('widgets.quote.favourite')}>
          <MdStarBorder className="copyButton" />
        </button>
      </Tooltip>
    ),
  };

  return (
    <div className="quote-buttons">
      {localStorage.getItem('copyButton') === 'true' && buttons.copy}
      {localStorage.getItem('quoteShareButton') === 'true' && buttons.share}
      {localStorage.getItem('favouriteQuoteEnabled') === 'true' && buttons.favourite}
    </div>
  );
};

export default QuoteButtons;
