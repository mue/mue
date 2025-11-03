import { createContext, useContext } from 'react';

const MarketplaceContext = createContext(null);

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};

export { MarketplaceContext };
