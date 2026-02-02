import variables from 'config/variables';
import { MdExplore } from 'react-icons/md';
import { Dropdown } from 'components/Form/Settings';
import { Row, Content, Action } from 'components/Layout/Settings/Item';
import { Button } from 'components/Elements';
import Items from 'features/marketplace/components/Items/Items';
import { getBackgroundOptionItems } from '../optionTypes';
import PhotoPackSettings from './PhotoPackSettings';

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
  const showInstalledPhotoPacks =
    backgroundType === 'photo_pack' &&
    marketplaceEnabled &&
    installedPhotoPacks.length > 0;

  return (
    <>
      <Row final={!showInstalledPhotoPacks && (backgroundType === 'random_colour' || backgroundType === 'random_gradient')}>
        <Content
          title={variables.getMessage('modals.main.settings.sections.background.source.title')}
          subtitle={variables.getMessage('modals.main.settings.sections.background.source.subtitle')}
        />
        <Action>
          <Dropdown
            label={variables.getMessage('modals.main.settings.sections.background.type.title')}
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
              title={variables.getMessage('modals.main.settings.sections.background.installed_packs_title')}
              subtitle={`${installedPhotoPacks.length} ${installedPhotoPacks.length === 1 ? 'pack' : 'packs'} • ${totalPhotoCount} ${totalPhotoCount === 1 ? 'photo' : 'photos'}`}
            />
            <Action>
              <Button onClick={onGoToPhotoPacks} icon={<MdExplore />} label="Get more" />
            </Action>
          </Row>
          <Items
            items={installedPhotoPacks}
            isAdded={true}
            filter=""
            toggleFunction={onToggle}
            showCreateYourOwn={false}
            onUninstall={onPhotoPackUninstall}
            viewType="grid"
          />
          
          {/* Settings for API packs */}
          {installedPhotoPacks.map((pack) =>
            pack.api_enabled ? <PhotoPackSettings key={pack.id} pack={pack} /> : null,
          )}
        </>
      )}
    </>
  );
};

export default SourceSection;
