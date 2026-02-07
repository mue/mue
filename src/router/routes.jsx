import { lazy } from 'react';
import { Navigate } from 'react-router';
import App from '../App';
import ErrorElement from './ErrorElement';

// Lazy load tab components
const Settings = lazy(() => import('../features/misc/views/Settings'));
const Discover = lazy(() => import('../features/misc/views/Discover'));
const Library = lazy(() => import('../features/misc/views/Library'));

/**
 * React Router v7 route configuration for Mue browser extension
 * Uses hash-based routing for browser extension compatibility
 *
 * Note: During migration, routes are used for state management.
 * The App component renders the full page with background/widgets.
 * The Modals component within App handles the actual modal rendering.
 */
export const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorElement />,
    children: [
      {
        index: true,
        // Empty index route - app without modal open
        element: <div style={{ display: 'none' }} />,
      },
      {
        path: 'settings',
        element: <div style={{ display: 'none' }} />,
      },
      {
        path: 'settings/:section',
        element: <div style={{ display: 'none' }} />,
      },
      {
        path: 'settings/:section/:subsection',
        element: <div style={{ display: 'none' }} />,
      },
      {
        path: 'discover',
        element: <div style={{ display: 'none' }} />,
      },
      {
        path: 'discover/:category',
        element: <div style={{ display: 'none' }} />,
      },
      {
        path: 'discover/item/:itemId',
        element: <div style={{ display: 'none' }} />,
      },
      {
        path: 'discover/collection/:collectionId',
        element: <div style={{ display: 'none' }} />,
      },
      {
        path: 'discover/collection/:collectionId/:itemId',
        element: <div style={{ display: 'none' }} />,
      },
      {
        path: 'discover/:category/:itemId',
        element: <div style={{ display: 'none' }} />,
      },
      {
        path: 'library',
        element: <div style={{ display: 'none' }} />,
      },
      {
        path: 'library/:section',
        element: <div style={{ display: 'none' }} />,
      },
      // Legacy marketplace alias redirects to discover
      {
        path: 'marketplace',
        element: <Navigate to="/discover" replace />,
      },
      {
        path: 'marketplace/:category',
        element: <Navigate to="/discover/:category" replace />,
      },
      {
        path: 'marketplace/:category/:itemId',
        element: <Navigate to="/discover/:category/:itemId" replace />,
      },
    ],
  },
];
