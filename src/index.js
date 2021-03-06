import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import * as Constants from './modules/constants';

import './scss/index.scss';
// the toast css is based on default so we need to import it
import 'react-toastify/dist/ReactToastify.min.css';

// this is opt-in btw, allows you to see your stats etc
import Stats from './modules/helpers/stats';

// language
import merge from '@material-ui/utils/esm/deepmerge';

const languagecode = localStorage.getItem('language') || 'en_GB';

// we set things to window. so we avoid passing the translation strings as props to each component
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

window.constants = Constants;
// doesn't send to umami when offline mode is on
if (localStorage.getItem('stats') === 'true') {
  window.stats = new Stats(window.constants.UMAMI_ID);
} else {
  window.stats = {
    tabLoad: () => '',
    postEvent: () => '' 
  } 
}

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
