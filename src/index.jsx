import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import variables from 'config/variables';

import * as Sentry from '@sentry/react';

import App from './App';
import ErrorBoundary from './ErrorBoundary';
import { migrateAPIUsersToPhotoPacks } from './utils/migrations';
import { router } from './router';

import './scss/index.scss';
import 'react-toastify/dist/ReactToastify.css';

import { initTranslations, loadTranslationWithFallback } from 'lib/translations';

const container = document.getElementById('root');
const root = createRoot(container);

(async () => {
  try {
    const languagecode = localStorage.getItem('language') || 'en_GB';

    const translations = await loadTranslationWithFallback(languagecode);
    variables.language = initTranslations(languagecode, translations);
    variables.languagecode = languagecode;

    document.documentElement.lang = languagecode.replace('_', '-');

    window.t = (text, optional) =>
      variables.language.getMessage(variables.languagecode, text, optional || {});

    migrateAPIUsersToPhotoPacks();

    Sentry.init({
      dsn: variables.constants.SENTRY_DSN,
      defaultIntegrations: false,
      autoSessionTracking: false,
    });

    root.render(
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>,
    );
  } catch (error) {
    console.error('Failed to initialize translations:', error);
    root.render(<div>Failed to load application. Please refresh.</div>);
  }
})();
