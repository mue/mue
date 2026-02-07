import { useT } from 'contexts';
import QuoteButtons from './QuoteButtons';

/**
 * Author information component (legacy style)
 */
export default function AuthorInfoLegacy({
  author,
  authorlink,
  onCopy,
  onFavourite,
  onShare,
  onInfo,
  isFavourited,
}) {
  const t = useT();
  return (
    <>
      <div>
        <h1 className="quoteauthor">
          {authorlink ? (
            <a
              href={authorlink}
              className="quoteAuthorLink"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('widgets.quote.author_info_aria')}
            >
              {author}
            </a>
          ) : (
            <span>{author}</span>
          )}
        </h1>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <QuoteButtons
          onCopy={onCopy}
          onFavourite={onFavourite}
          onShare={onShare}
          isFavourited={isFavourited}
        />
      </div>
    </>
  );
}
