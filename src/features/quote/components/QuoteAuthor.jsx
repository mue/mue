import { MdPerson, MdOpenInNew } from 'react-icons/md';
import variables from 'config/variables';
import { Tooltip } from 'components/Elements';

const QuoteAuthor = ({
  author,
  authorOccupation,
  authorImg,
  authorImgLicense,
  authorLink,
  buttons,
}) => {
  if (!author) {
    return (
      <div className="author-content whileLoading">
        <span className="title pulse">loading</span>
        <span className="subtitle pulse">loading</span>
      </div>
    );
  }

  return (
    <div className="author">
      {localStorage.getItem('authorImg') !== 'false' && (
        <div className="author-img" style={{ backgroundImage: `url(${authorImg})` }}>
          {!authorImg && <MdPerson />}
        </div>
      )}
      <div className="author-content">
        <span className="title">{author}</span>
        {authorOccupation !== 'Unknown' && <span className="subtitle">{authorOccupation}</span>}
        <span className="author-license" title={authorImgLicense}>
          {authorImgLicense &&
            authorImgLicense.substring(0, 40) + (authorImgLicense.length > 40 ? '…' : '')}
        </span>
      </div>
      {(authorOccupation !== 'Unknown' || authorLink || buttons) && (
        <div className="quote-buttons">
          {authorLink && authorOccupation !== 'Unknown' && (
            <Tooltip title={variables.getMessage('widgets.quote.link_tooltip')}>
              <a
                href={authorLink}
                className="quoteAuthorLink"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Learn about the author of the quote."
              >
                <MdOpenInNew />
              </a>
            </Tooltip>
          )}
          {buttons}
        </div>
      )}
    </div>
  );
};

export default QuoteAuthor;
