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
  isFavourited,
}) {
  return (
    <>
      <div>
        <h1 className="quoteauthor">
          <a
            href={authorlink}
            className="quoteAuthorLink"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Learn about the author of the quote."
          >
            {author}
          </a>
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
