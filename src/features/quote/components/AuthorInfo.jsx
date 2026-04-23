import { MdPerson } from 'react-icons/md';
import { HiMiniArrowUpRight } from 'react-icons/hi2';
import { Tooltip } from 'components/Elements';
import { useT } from 'contexts';
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
  onInfo,
  isFavourited,
}) {
  const t = useT();
  const showAuthorImg = localStorage.getItem('authorImg') !== 'false';
  const hasLink = authorOccupation !== 'Unknown' && authorlink !== null;

  return (
    <div className="author-holder">
      <div className="author">
        {showAuthorImg &&
          (authorimglicense && authorimg ? (
            <Tooltip title={authorimglicense}>
              <div className="author-img" style={{ backgroundImage: `url(${authorimg})` }}>
                {!authorimg && authorimg !== undefined && <MdPerson />}
              </div>
            </Tooltip>
          ) : (
            <div className="author-img" style={{ backgroundImage: `url(${authorimg})` }}>
              {!authorimg && authorimg !== undefined && <MdPerson />}
            </div>
          ))}

        {author ? (
          <div className="author-content">
            {hasLink ? (
              <a
                href={authorlink}
                className="author-name-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('widgets.quote.author_info_aria')}
              >
                <span className="title">{author}</span>
                <HiMiniArrowUpRight className="author-arrow" />
              </a>
            ) : (
              <span className="title">{author}</span>
            )}
            {authorOccupation && authorOccupation !== 'Unknown' && (
              <span className="subtitle">{authorOccupation}</span>
            )}
          </div>
        ) : (
          <div className="author-content whileLoading">
            <span className="title pulse">loading</span>
            <span className="subtitle pulse">loading</span>
          </div>
        )}

        <div className="quote-buttons">
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
