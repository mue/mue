import { createRoot } from 'react-dom/client';

import * as Sentry from '@sentry/react';

import App from './App';
import ErrorBoundary from './ErrorBoundary';
import variables from './config/variables';

import './scss/index.scss';
// the toast css is based on default so we need to import it
import 'react-toastify/dist/ReactToastify.min.css';

import { initTranslations } from 'lib/translations';

const languagecode = localStorage.getItem('language') || 'en_GB';
variables.language = initTranslations(languagecode);
variables.languagecode = languagecode;
document.documentElement.lang = languagecode.replace('_', '-');

variables.getMessage = (text, optional) =>
  variables.language.getMessage(variables.languagecode, text, optional || {});

Sentry.init({
  dsn: variables.constants.SENTRY_DSN,
  defaultIntegrations: false,
  autoSessionTracking: false,
});

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
