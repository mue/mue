import React from 'react';

import MarketplaceTab from '../marketplace/sections/Marketplace';

import Tabs from './backend/Tabs';

export default function Marketplace() {
  return (
    <Tabs>
      <div label='Photo Packs'><MarketplaceTab type='photo_packs'/></div>
      <div label='Quote Packs'><MarketplaceTab type='quote_packs'/></div>
    </Tabs>
  );
}
