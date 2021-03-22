import React from 'react';

import MarketplaceBackend from '../marketplace/sections/Marketplace';
import MarketplaceTabs from './backend/Tabs';

export default function Marketplace() {
  return (
    <>
      <MarketplaceTabs>
        <div label='Photo Packs'>
          <MarketplaceBackend type='photo_packs'/>
        </div>
        <div label='Quote Packs'>
          <MarketplaceBackend type='quote_packs'/>
        </div>
      </MarketplaceTabs>
    </>
  );
}
