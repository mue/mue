import { registerHandler } from './handlerRegistry';
import { photoPackHandler } from 'features/background/marketplace/photoPackHandler';
import { quotePackHandler } from 'features/quote/marketplace/quotePackHandler';
import { settingsHandler } from './handlers/settingsHandler';

export function registerAllHandlers() {
  registerHandler('photos', photoPackHandler);
  registerHandler('quotes', quotePackHandler);
  registerHandler('settings', settingsHandler);
}
