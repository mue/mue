import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import './scss/index.scss';
// the toast css is based on default so we need to import it
import 'react-toastify/dist/ReactToastify.css';

import '@fontsource/lexend-deca/latin-400.css';
import '@fontsource/roboto/cyrillic-400.css';

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
