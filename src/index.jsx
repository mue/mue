import { render } from 'react-dom';

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
import * as de_DE from './translations/de_DE.json';
import * as en_GB from './translations/en_GB.json';
import * as en_US from './translations/en_US.json';
import * as es from './translations/es.json';
import * as fr from './translations/fr.json';
import * as nl from './translations/nl.json';
import * as no from './translations/no.json';
import * as ru from './translations/ru.json';
import * as zh_CN from './translations/zh_CN.json';
import * as id_ID from './translations/id_ID.json';

const languagecode = localStorage.getItem('language') || 'en_GB';

// we set things to variables. so we avoid passing the translation strings etc as props to each component
variables.languagecode = languagecode.replace('-', '_');

if (languagecode === 'en') {
  variables.languagecode = 'en_GB';
}

variables.language = new I18n(variables.languagecode, {
  de_DE,
  en_GB,
  en_US,
  es,
  fr,
  nl,
  no,
  ru,
  zh_CN,
  id_ID,
});

// set html language tag
if (variables.languagecode !== 'en_GB' || variables.languagecode !== 'en_US') {
  document.documentElement.lang = variables.languagecode.split('_')[0];
}

if (localStorage.getItem('stats') === 'true') {
  variables.stats = Stats;
}

/*if (localStorage.getItem('keybindsEnabled') === 'true') {
  variables.keybinds = JSON.parse(localStorage.getItem('keybinds') || '{}');
}*/

render(<App />, document.getElementById('root'));
