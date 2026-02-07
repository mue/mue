import { memo } from 'react';
import { useNavigate } from 'react-router';
import { MdClose, MdWarning, MdSource, MdPerson, MdCategory } from 'react-icons/md';
import { HiMiniArrowUpRight } from 'react-icons/hi2';
import { Tooltip, Button } from 'components/Elements';
import variables from 'config/variables';

/**
 * QuoteInfoModal - displays information about the current quote
 */
function QuoteInfoModal({ modalClose, quoteData }) {
  const navigate = useNavigate();
  const getQuoteSource = () => {
    const type = localStorage.getItem('quoteType') || 'quote_pack';
    const offline = localStorage.getItem('offlineMode') === 'true';

    if (offline) {
      return variables.getMessage('widgets.quote.info.source_offline') || 'Offline Mode';
    }

    switch (type) {
      case 'custom':
        return variables.getMessage('widgets.quote.info.source_custom') || 'Custom Quote';
      case 'quote_pack':
        return (
          quoteData.packName ||
          variables.getMessage('widgets.quote.info.source_pack') ||
          'Quote Pack'
        );
      default:
        return variables.getMessage('widgets.quote.info.source_unknown') || 'Unknown';
    }
  };

  const getQuoteType = () => {
    const type = localStorage.getItem('quoteType') || 'quote_pack';
    const offline = localStorage.getItem('offlineMode') === 'true';

    if (offline) {
      return variables.getMessage('widgets.quote.info.type_offline') || 'Offline';
    }

    switch (type) {
      case 'custom':
        return variables.getMessage('widgets.quote.info.type_custom') || 'Custom';
      case 'quote_pack':
        return variables.getMessage('widgets.quote.info.type_pack') || 'Quote Pack';
      default:
        return variables.getMessage('widgets.quote.info.type_unknown') || 'Unknown';
    }
  };

  const hasWarning = quoteData.authorimg || quoteData.authorOccupation;

  return (
    <div className="quoteInfoModal">
      <div className="shareHeader">
        <h4>{variables.getMessage('widgets.quote.info.title') || 'Quote Information'}</h4>
        <Tooltip title={variables.getMessage('modals.welcome.buttons.close')}>
          <div className="close" onClick={modalClose}>
            <MdClose />
          </div>
        </Tooltip>
      </div>
      <div className="quoteInfoContent">
        {/* Warning about automatic data */}
        {hasWarning && (
          <div className="quoteInfoWarning">
            <div className="warningIcon">
              <MdWarning />
            </div>
            <div className="warningText">
              <p>
                {variables.getMessage('widgets.quote.info.warning') ||
                  "The author's image, occupation and wikipedia page are automatically sourced from Wikipedia and Wikidata and may not always be accurate."}
              </p>
            </div>
          </div>
        )}

        {/* Quote Information */}
        <div className="quoteInfoSection">
          <div className="quoteInfoRow">
            <div className="quoteInfoIcon">
              <MdCategory />
            </div>
            <div className="quoteInfoText">
              <span className="quoteInfoLabel">
                {variables.getMessage('widgets.quote.info.type') || 'Type'}
              </span>
              <span className="quoteInfoValue">{getQuoteType()}</span>
            </div>
          </div>

          {quoteData.realAuthor && quoteData.realAuthor !== quoteData.author && (
            <div className="quoteInfoRow">
              <div className="quoteInfoIcon">
                <MdPerson />
              </div>
              <div className="quoteInfoText">
                <span className="quoteInfoLabel">
                  {variables.getMessage('widgets.quote.info.original_author') || 'Original Author'}
                </span>
                <span className="quoteInfoValue">{quoteData.realAuthor}</span>
              </div>
            </div>
          )}

          <div className="quoteInfoRow">
            <div className="quoteInfoIcon">
              <MdSource />
            </div>
            <div className="quoteInfoText">
              <span className="quoteInfoLabel">
                {variables.getMessage('widgets.quote.info.source') || 'Source'}
              </span>
              <span className="quoteInfoValue">
                {quoteData.packId ? (
                  <span
                    className="quoteInfoLink"
                    onClick={() => navigate(`/discover/item/${quoteData.packId}`)}
                  >
                    {getQuoteSource()}
                    <HiMiniArrowUpRight />
                  </span>
                ) : (
                  getQuoteSource()
                )}
              </span>
            </div>
          </div>

          {quoteData.authorOccupation && quoteData.authorOccupation !== 'Unknown' && (
            <div className="quoteInfoRow">
              <div className="quoteInfoIcon">
                <MdPerson />
              </div>
              <div className="quoteInfoText">
                <span className="quoteInfoLabel">
                  {variables.getMessage('widgets.quote.info.occupation') || 'Occupation'}
                </span>
                <span className="quoteInfoValue">{quoteData.authorOccupation}</span>
              </div>
            </div>
          )}

          {quoteData.authorlink && (
            <div className="quoteInfoRow">
              <div className="quoteInfoIcon">
                <MdSource />
              </div>
              <div className="quoteInfoText">
                <span className="quoteInfoLabel">
                  {variables.getMessage('widgets.quote.info.wikipedia') || 'Wikipedia'}
                </span>
                <span className="quoteInfoValue">
                  <a
                    href={quoteData.authorlink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="quoteInfoLink"
                  >
                    {variables.getMessage('widgets.quote.info.view_article') || 'View Article'}
                    <HiMiniArrowUpRight />
                  </a>
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="quoteInfoFooter">
          <Button
            type="settings"
            onClick={modalClose}
            label={variables.getMessage('modals.welcome.buttons.close') || 'Close'}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(QuoteInfoModal);
