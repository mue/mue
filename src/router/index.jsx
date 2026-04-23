import { createHashRouter } from 'react-router';
import { routes } from './routes';

/**
 * Create hash-based router for browser extension compatibility
 * Hash router ensures all routes stay within the extension page
 * and prevents Chrome from looking for non-existent physical files
 */
export const router = createHashRouter(routes);
