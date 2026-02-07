import React from 'react';
import { useNavigate } from 'react-router';
import { MdExplore } from 'react-icons/md';
import { useT } from 'contexts';
import { Row, Content, Action } from 'components/Layout/Settings';
import { Button } from 'components/Elements';
import Items from 'features/marketplace/components/Items/Items';
import { useSuggestedPacks } from './useSuggestedPacks';

/**
 * Component that displays suggested packs from the marketplace
 * @param {Object} props
 * @param {string} props.category - 'quote_packs' or 'photo_packs'
 * @param {number} props.limit - Number of suggestions to display (default: 4)
 * @param {number} props.minToShow - Minimum suggestions to show, hide if fewer (default: 2)
 */
const SuggestedPacks = ({ category, limit = 4, minToShow = 2 }) => {
  const t = useT();
  const navigate = useNavigate();
  const { suggestions, loading, error } = useSuggestedPacks(category, limit, minToShow);

  // Don't render anything while loading, on error, or if no suggestions
  if (loading || error || !suggestions || suggestions.length === 0) {
    return null;
  }

  // Determine the section key based on category
  const sectionKey = category === 'quote_packs' ? 'quote' : 'background';

  // Navigate to marketplace category page
  const goToMarketplace = () => {
    navigate(`/discover/${category}`);
  };

  // Navigate to specific item detail page
  const navigateToItem = (item) => {
    const itemId = item.id || item.name;
    navigate(`/discover/item/${itemId}`);
  };

  return (
    <>
      <Row final={false}>
        <Content
          title={t(`modals.main.settings.sections.${sectionKey}.suggested_packs_title`)}
          subtitle={t(`modals.main.settings.sections.${sectionKey}.suggested_packs_subtitle`)}
        />
        <Action>
          <Button
            type="settings"
            onClick={goToMarketplace}
            icon={<MdExplore />}
            label={t(`modals.main.settings.sections.${sectionKey}.explore_all`)}
          />
        </Action>
      </Row>
      <Items
        items={suggestions}
        isAdded={false}
        filter=""
        toggleFunction={navigateToItem}
        showCreateYourOwn={false}
        viewType="grid"
        showChips={false}
        style={{ paddingBottom: '3rem' }}
      />
    </>
  );
};

export default SuggestedPacks;
