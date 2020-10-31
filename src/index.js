import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import 'react-color-gradient-picker/dist/index.css';
import './scss/react-color-picker-gradient-picker-custom-styles.scss';
import './scss/index.scss';
import 'react-toastify/dist/ReactToastify.css'; // the toast css is based on default so we need to import it

import 'fontsource-lexend-deca/latin-400-normal.css';
import 'fontsource-roboto/cyrillic-400-normal.css';

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);
