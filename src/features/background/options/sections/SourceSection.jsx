import { useT } from 'contexts';
import { MdExplore } from 'react-icons/md';
import { Dropdown } from 'components/Form/Settings';
import { Row, Content, Action } from 'components/Layout/Settings/Item';
import { Button } from 'components/Elements';
import Items from 'features/marketplace/components/Items/Items';
import SuggestedPacks from 'features/marketplace/components/SuggestedPacks';
import { getBackgroundOptionItems } from '../optionTypes';

const SourceSection = ({
  backgroundType,
  marketplaceEnabled,
  installedPhotoPacks = [],
  totalPhotoCount = 0,
  onTypeChange,
  onPhotoPackUninstall,
  onGoToPhotoPacks,
  onToggle,
}) => {
  const t = useT();
  const showInstalledPhotoPacks =
    backgroundType === 'photo_pack' && marketplaceEnabled && installedPhotoPacks.length > 0;

  return (
    <>
      <Row
        final={
          !showInstalledPhotoPacks &&
          (backgroundType === 'random_colour' || backgroundType === 'random_gradient')
        }
      >
        <Content
          title={t('modals.main.settings.sections.background.source.title')}
          subtitle={t('modals.main.settings.sections.background.source.subtitle')}
        />
        <Action>
          <Dropdown
            label={t('modals.main.settings.sections.background.type.title')}
            name="backgroundType"
            onChange={onTypeChange}
            category="background"
            items={getBackgroundOptionItems(marketplaceEnabled)}
          />
        </Action>
      </Row>

      {showInstalledPhotoPacks && (
        <>
          <Row final={true}>
            <Content
              title={t('modals.main.settings.sections.background.installed_packs_title')}
              subtitle={`${installedPhotoPacks.length} ${installedPhotoPacks.length === 1 ? t('modals.main.settings.sections.background.source.pack_count.singular') : t('modals.main.settings.sections.background.source.pack_count.plural')} • ${totalPhotoCount} ${totalPhotoCount === 1 ? t('modals.main.settings.sections.background.source.photo_count.singular') : t('modals.main.settings.sections.background.source.photo_count.plural')}`}
            />
            <Action>
              <Button
                type="settings"
                onClick={onGoToPhotoPacks}
                icon={<MdExplore />}
                label={t('modals.main.settings.sections.background.source.get_more')}
              />
            </Action>
          </Row>
          <Items
            items={installedPhotoPacks}
            isAdded={true}
            filter=""
            toggleFunction={onToggle}
            showCreateYourOwn={false}
            onUninstall={onPhotoPackUninstall}
            onTogglePack={() => {}}
            viewType="grid"
            showChips={false}
          />
          <SuggestedPacks category="photo_packs" />
        </>
      )}
    </>
  );
};

export default SourceSection;
