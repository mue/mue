import { render } from 'react-dom';
import * as Sentry from '@sentry/react';

import App from './App';
import variables from 'modules/variables';

import './scss/index.scss';
// the toast css is based on default so we need to import it
import 'react-toastify/dist/ReactToastify.min.css';

// local stats
import Stats from 'modules/helpers/stats';

// language
import I18n from '@eartharoid/i18n';

// this is because of vite
import translations from 'modules/translations';

const languagecode = localStorage.getItem('language') || 'en_GB';

// we set things to variables. so we avoid passing the translation strings etc as props to each component
variables.languagecode = languagecode.replace('-', '_');

if (languagecode === 'en') {
  variables.languagecode = 'en_GB';
}

variables.language = new I18n(variables.languagecode, {
  de_DE: translations.de_DE,
  en_GB: translations.en_GB,
  en_US: translations.en_US,
  es: translations.es,
  fr: translations.fr,
  nl: translations.nl,
  no: translations.no,
  ru: translations.ru,
  zh_CN: translations.zh_CN,
  id_ID: translations.id_ID,
  tr_TR: translations.tr_TR,
});

variables.getMessage = (text, optional) =>
  variables.language.getMessage(variables.languagecode, text, optional || {});

// set html language tag
if (variables.languagecode !== 'en_GB' || variables.languagecode !== 'en_US') {
  document.documentElement.lang = variables.languagecode.split('_')[0];
}

if (localStorage.getItem('stats') === 'true') {
  variables.stats = Stats;
}

Sentry.init({
  dsn: variables.constants.SENTRY_DSN,
  defaultIntegrations: false,
  autoSessionTracking: false,
});

render(<App />, document.getElementById('root'));
