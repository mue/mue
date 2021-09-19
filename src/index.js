import { render } from 'react-dom';

import App from './App';
import * as Constants from 'modules/constants';
import variables from './modules/variables';

import './scss/index.scss';
// the toast css is based on default so we need to import it
import 'react-toastify/dist/ReactToastify.min.css';

// local stats
import Stats from 'modules/helpers/stats';

// language
import I18n from '@eartharoid/i18n';
const languagecode = localStorage.getItem('language') || 'en_GB';

// we set things to window. so we avoid passing the translation strings as props to each component
variables.languagecode = languagecode.replace('-', '_');

if (languagecode === 'en') {
  variables.languagecode = 'en_GB';
}

import('./translations/' + variables.languagecode + '.json').then((language) => {
  variables.language = new I18n(variables.languagecode, {
    [variables.languagecode]: language
  });

  // set html language tag
  if (variables.languagecode !== 'en_GB' || variables.languagecode !== 'en_US') {
    document.documentElement.lang = variables.languagecode.split('_')[0];
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
});
