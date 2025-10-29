import variables from 'config/variables';
import { memo } from 'react';

import Tabs from '../../../components/Elements/MainModal/backend/Tabs';
import MarketplaceTab from '../../marketplace/views/Browse';

function Discover({
  changeTab,
  deepLinkData,
  currentTab,
  onSectionChange,
  onProductView,
  resetToAll,
  onResetToAll,
  navigationTrigger,
}) {
  return (
    <Tabs
      changeTab={(type) => changeTab(type)}
      current="discover"
      currentTab={currentTab}
      onSectionChange={onSectionChange}
      resetToFirst={resetToAll}
    >
      <div label={variables.getMessage('modals.main.marketplace.all')} name="all">
        <MarketplaceTab
          type="all"
          deepLinkData={deepLinkData}
          onProductView={onProductView}
          onResetToAll={onResetToAll}
          navigationTrigger={navigationTrigger}
        />
      </div>
      <div label={variables.getMessage('modals.main.marketplace.photo_packs')} name="photo_packs">
        <MarketplaceTab
          type="photo_packs"
          deepLinkData={deepLinkData}
          onProductView={onProductView}
          onResetToAll={onResetToAll}
          navigationTrigger={navigationTrigger}
        />
      </div>
      <div label={variables.getMessage('modals.main.marketplace.quote_packs')} name="quote_packs">
        <MarketplaceTab
          type="quote_packs"
          deepLinkData={deepLinkData}
          onProductView={onProductView}
          onResetToAll={onResetToAll}
          navigationTrigger={navigationTrigger}
        />
      </div>
      <div
        label={variables.getMessage('modals.main.marketplace.preset_settings')}
        name="preset_settings"
      >
        <MarketplaceTab
          type="preset_settings"
          deepLinkData={deepLinkData}
          onProductView={onProductView}
          onResetToAll={onResetToAll}
          navigationTrigger={navigationTrigger}
        />
      </div>
      <div label={variables.getMessage('modals.main.marketplace.collections')} name="collections">
        <MarketplaceTab
          type="collections"
          deepLinkData={deepLinkData}
          onProductView={onProductView}
          onResetToAll={onResetToAll}
          navigationTrigger={navigationTrigger}
        />
      </div>
    </Tabs>
  );
}

export default memo(Discover);
