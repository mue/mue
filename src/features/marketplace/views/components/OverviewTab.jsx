import variables from 'config/variables';
import { useMemo } from 'react';
import { MdCalendarMonth, MdFormatQuote, MdImage, MdTranslate, MdStyle } from 'react-icons/md';
import { Carousel } from '../../components/Elements/Carousel';
import placeholderIcon from 'assets/icons/marketplace-placeholder.png';
import InfoItem from './InfoItem';

const OverviewTab = ({
  data,
  description,
  iconsrc,
  shortLocale,
  languageNames,
  formattedDate,
  getName,
  count,
  onIncrementCount,
}) => {
  const quotes = Array.isArray(data.quotes) ? data.quotes : [];
  const photos = Array.isArray(data.photos) ? data.photos : [];
  const hasPhotos = photos.length > 0;
  const hasQuotes = quotes.length > 0;
  const hasSettings = data.settings;

  // Memoize expensive quote statistics calculations
  const { totalQuotes, uniqueAuthorsCount, averageCharacters } = useMemo(() => {
    if (!hasQuotes || quotes.length === 0) {
      return { totalQuotes: 0, uniqueAuthorsCount: 0, averageCharacters: 0 };
    }

    const total = quotes.length;
    const uniqueAuthors = new Set(quotes.map((quote) => quote.author)).size;
    const avgChars = Math.round(
      quotes.reduce(
        (accumulator, quote) => accumulator + (quote.quote ? quote.quote.length : 0),
        0,
      ) / quotes.length,
    );

    return {
      totalQuotes: total,
      uniqueAuthorsCount: uniqueAuthors,
      averageCharacters: avgChars,
    };
  }, [quotes, hasQuotes]);

  const totalQuotesLabel =
    variables.getMessage('modals.main.marketplace.product.no_quotes') || 'Total quotes';
  const uniqueAuthorsLabel =
    variables.getMessage('modals.main.marketplace.product.unique_authors') || 'Unique authors';
  const averageCharactersLabel =
    variables.getMessage('modals.main.marketplace.product.average_characters') || 'Avg. characters';

  const formatNumber = (value) =>
    typeof value === 'number' ? value.toLocaleString(shortLocale) : value;

  return (
    <>
      {/* Preview image for settings presets */}
      {hasSettings && (
        <img
          alt="product"
          draggable={false}
          src={iconsrc}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderIcon;
          }}
        />
      )}

      {/* Description */}
      <div className="marketplaceDescription">
        <span className="title">
          {variables.getMessage('modals.main.marketplace.product.description')}
        </span>
        <span className="subtitle" dangerouslySetInnerHTML={{ __html: description }} />
      </div>

      {/* Quote pack statistics */}
      {hasQuotes && (
        <div className="itemHighlights">
          <div className="highlightCard">
            <span className="highlightLabel">{totalQuotesLabel}</span>
            <span className="highlightValue">{formatNumber(totalQuotes)}</span>
          </div>
          <div className="highlightCard">
            <span className="highlightLabel">{uniqueAuthorsLabel}</span>
            <span className="highlightValue">{formatNumber(uniqueAuthorsCount)}</span>
          </div>
          <div className="highlightCard">
            <span className="highlightLabel">{averageCharactersLabel}</span>
            <span className="highlightValue">{formatNumber(averageCharacters)}</span>
          </div>
        </div>
      )}

      {/* Details section */}
      <div className="marketplaceDescription marketplaceDetails">
        <span className="title">
          {variables.getMessage('modals.main.marketplace.product.details')}
        </span>
        <div className="moreInfo">
          {data.updated_at && (
            <InfoItem
              icon={<MdCalendarMonth />}
              header={variables.getMessage('modals.main.marketplace.product.updated_at')}
              text={formattedDate}
            />
          )}
          {hasQuotes && (
            <InfoItem
              icon={<MdFormatQuote />}
              header={variables.getMessage('modals.main.marketplace.product.no_quotes')}
              text={quotes.length}
            />
          )}
          {hasPhotos && (
            <InfoItem
              icon={<MdImage />}
              header={variables.getMessage('modals.main.marketplace.product.no_images')}
              text={photos.length}
            />
          )}
          {hasQuotes && data.language && (
            <InfoItem
              icon={<MdTranslate />}
              header={variables.getMessage('modals.main.settings.sections.language.title')}
              text={languageNames.of(data.language)}
            />
          )}
          <InfoItem
            icon={<MdStyle />}
            header={variables.getMessage('modals.main.settings.sections.background.type.title')}
            text={
              variables.getMessage('modals.main.marketplace.' + getName(data.type)) || 'marketplace'
            }
          />
        </div>
      </div>
    </>
  );
};

export default OverviewTab;
