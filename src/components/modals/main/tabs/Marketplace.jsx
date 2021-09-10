import variables from 'modules/variables';
import Tabs from './backend/Tabs';

import MarketplaceTab from '../marketplace/sections/Marketplace';

export default function Marketplace() {
  const getMessage = (languagecode, text) => variables.language.getMessage(languagecode, text);
  const languagecode = variables.languagecode;

  return (
    <Tabs>
      <div label={getMessage(languagecode, 'modals.main.marketplace.photo_packs')} name='photo_packs'><MarketplaceTab type='photo_packs'/></div>
      <div label={getMessage(languagecode, 'modals.main.marketplace.quote_packs')} name='quote_packs'><MarketplaceTab type='quote_packs'/></div>
      <div label={getMessage(languagecode, 'modals.main.marketplace.preset_setitngs')} name='preset_settings'><MarketplaceTab type='preset_settings'/></div>
    </Tabs>
  );
}
