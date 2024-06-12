import variables from 'config/variables';
import { memo } from 'react';

import Tabs from '../../../components/Elements/MainModal/backend/Tabs';
import MarketplaceTab from '../../marketplace/views/Browse';

function Marketplace(props) {
  return (
    <Tabs changeTab={(type) => props.changeTab(type)} current="marketplace" modalClose={props.modalClose}>
      <div label={variables.getMessage('modals.main.marketplace.all')} name="all">
        <MarketplaceTab type="all" />
      </div>
      <div label={variables.getMessage('modals.main.marketplace.photo_packs')} name="photo_packs">
        <MarketplaceTab type="photo_packs" />
      </div>
      <div label={variables.getMessage('modals.main.marketplace.quote_packs')} name="quote_packs">
        <MarketplaceTab type="quote_packs" />
      </div>
      <div
        label={variables.getMessage('modals.main.marketplace.preset_settings')}
        name="preset_settings"
      >
        <MarketplaceTab type="preset_settings" />
      </div>
      <div label={variables.getMessage('modals.main.marketplace.collections')} name="collections">
        <MarketplaceTab type="collections" />
      </div>
    </Tabs>
  );
}

export default memo(Marketplace);
