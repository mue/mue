import React from 'react';

import MarketplaceTab from '../marketplace/sections/Marketplace';

import Tabs from './backend/Tabs';

export default function Marketplace() {
  const language = window.language.modals.main.marketplace;

  return (
    <Tabs>
      <div label={language.photo_packs}><MarketplaceTab type='photo_packs'/></div>
      <div label={language.quote_packs}><MarketplaceTab type='quote_packs'/></div>
    </Tabs>
  );
}
