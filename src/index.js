import { render } from 'react-dom';

import App from './App';
import * as Constants from './modules/constants';

import './scss/index.scss';
// the toast css is based on default so we need to import it
import 'react-toastify/dist/ReactToastify.min.css';

// local stats
import Stats from './modules/helpers/stats';

// language
const languagecode = localStorage.getItem('language') || 'en_GB';

// we set things to window. so we avoid passing the translation strings as props to each component
window.languagecode = languagecode.replace('-', '_');

if (languagecode === 'en') {
  window.languagecode = 'en_GB';
}

window.language = require(`./translations/${window.languagecode}.json`);

// set html language tag
if (window.languagecode !== 'en_GB' || window.languagecode !== 'en_US') {
  document.documentElement.lang = window.languagecode.split('_')[0];
}

window.constants = Constants;
if (localStorage.getItem('stats') === 'true') {
  window.stats = Stats;
} else {
  window.stats = {
    tabLoad: () => '',
    postEvent: () => '' 
  };
}

if (localStorage.getItem('keybindsEnabled') === 'true') {
  window.keybinds = JSON.parse(localStorage.getItem('keybinds') || '{}');
} else {
  window.keybinds = {};
}

render(
  <App/>,
  document.getElementById('root')
);
