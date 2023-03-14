import { render } from 'react-dom';
import * as Sentry from '@sentry/react';

import App from './App';
import variables from 'modules/variables';

import './scss/index.scss';
// the toast css is based on default so we need to import it
import 'react-toastify/dist/ReactToastify.min.css';

import Stats from 'modules/helpers/stats';

import translations from 'modules/translations';

const languagecode = localStorage.getItem('language') || 'en_GB';
variables.language = translations(languagecode);
variables.languagecode = languagecode;
document.documentElement.lang = languagecode.replace('_', '-');

variables.getMessage = (text, optional) =>
  variables.language.getMessage(variables.languagecode, text, optional || {});

if (localStorage.getItem('stats') === 'true') {
  variables.stats = Stats;
}

Sentry.init({
  dsn: variables.constants.SENTRY_DSN,
  defaultIntegrations: false,
  autoSessionTracking: false,
});

render(<App />, document.getElementById('root'));
