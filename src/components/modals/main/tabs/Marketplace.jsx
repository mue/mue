import Tabs from './backend/Tabs';

import MarketplaceTab from '../marketplace/sections/Marketplace';

export default function Marketplace() {
  const marketplace = window.language.modals.main.marketplace;

  return (
    <Tabs>
      <div label={marketplace.photo_packs} name='photo_packs'><MarketplaceTab type='photo_packs'/></div>
      <div label={marketplace.quote_packs} name='quote_packs'><MarketplaceTab type='quote_packs'/></div>
      <div label={marketplace.preset_settings} name='preset_settings'><MarketplaceTab type='preset_settings'/></div>
    </Tabs>
  );
}
