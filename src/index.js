import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import './scss/index.scss';
// the toast css is based on default so we need to import it
import 'react-toastify/dist/ReactToastify.css';

import '@fontsource/lexend-deca/latin-400.css';
import '@fontsource/roboto/cyrillic-400.css';

// language
import merge from './modules/helpers/merge';
const languagecode = localStorage.getItem('language') || 'en-GB';
// we set things to window. so they're global and we avoid passing the translation strings as props to each component
window.languagecode = languagecode;
window.language = merge(require('./translations/en-GB.json'), require(`./translations/${languagecode}.json`));

// window.constants
import * as Constants from './modules/constants';
window.constants = Constants;

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
