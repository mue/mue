import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import * as Constants from './modules/constants';

import './scss/index.scss';
// the toast css is based on default so we need to import it
import 'react-toastify/dist/ReactToastify.min.css';

import '@fontsource/lexend-deca/latin-400.css';
import '@fontsource/montserrat/cyrillic-500.css';

// language
import merge from '@material-ui/utils/esm/deepmerge';

const languagecode = localStorage.getItem('language') || 'en_GB';

// we set things to window. so they're global and we avoid passing the translation strings as props to each component
window.languagecode = languagecode.replace('-', '_');

if (languagecode === 'en') {
  window.languagecode = 'en_GB';
}

// these are merged so if a string is untranslated it doesn't break mue
window.language = merge(require('./translations/en_GB.json'), require(`./translations/${window.languagecode}.json`));

// set html language tag
if (window.languagecode !== 'en_GB' || window.languagecode !== 'en_US') {
  document.documentElement.lang = window.languagecode.split('_')[0];
}

// window.constants
window.constants = Constants;

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
