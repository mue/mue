import { MdPerson, MdOpenInNew } from 'react-icons/md';
import { Tooltip } from 'components/Elements';
import variables from 'config/variables';
import QuoteButtons from './QuoteButtons';

/**
 * Author information component (modern style)
 */
export default function AuthorInfo({
  author,
  authorOccupation,
  authorlink,
  authorimg,
  authorimglicense,
  onCopy,
  onFavourite,
  onShare,
  isFavourited,
}) {
  const showAuthorImg = localStorage.getItem('authorImg') !== 'false';
  const hasLink = authorOccupation !== 'Unknown' && authorlink !== null;
  const trimmedLicense = authorimglicense?.substring(0, 40) + 
                        (authorimglicense?.length > 40 ? '…' : '');

  return (
    <div className="author-holder">
      <div className="author">
        {showAuthorImg && (
          <div className="author-img" style={{ backgroundImage: `url(${authorimg})` }}>
            {!authorimg && authorimg !== undefined && <MdPerson />}
          </div>
        )}
        
        {author ? (
          <div className="author-content">
            <span className="title">{author}</span>
            {authorOccupation && authorOccupation !== 'Unknown' && (
              <span className="subtitle">{authorOccupation}</span>
            )}
            {authorimglicense && (
              <span className="author-license" title={authorimglicense}>
                {trimmedLicense}
              </span>
            )}
          </div>
        ) : (
          <div className="author-content whileLoading">
            <span className="title pulse">loading</span>
            <span className="subtitle pulse">loading</span>
          </div>
        )}
        
        <div className="quote-buttons">
          {hasLink && (
            <Tooltip title={variables.getMessage('widgets.quote.link_tooltip')}>
              <a
                href={authorlink}
                className="quoteAuthorLink"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Learn about the author of the quote."
              >
                <MdOpenInNew />
              </a>
            </Tooltip>
          )}
          <QuoteButtons
            onCopy={onCopy}
            onFavourite={onFavourite}
            onShare={onShare}
            isFavourited={isFavourited}
          />
        </div>
      </div>
    </div>
  );
}
