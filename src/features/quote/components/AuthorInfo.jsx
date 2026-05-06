import { MdPerson } from 'react-icons/md';
import { Tooltip } from 'components/Elements';
import QuoteButtons from './QuoteButtons';

export default function AuthorInfo({
  author,
  authorOccupation,
  authorimg,
  authorimglicense,
  onCopy,
  onFavourite,
  onShare,
  onInfo,
  isFavourited,
}) {
  const showAuthorImg = localStorage.getItem('authorImg') !== 'false';

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
          <div className="author-content" onClick={onInfo}>
            <span className="title">{author}</span>
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

        <QuoteButtons
          onCopy={onCopy}
          onFavourite={onFavourite}
          onShare={onShare}
          isFavourited={isFavourited}
        />
      </div>
    </div>
  );
}
