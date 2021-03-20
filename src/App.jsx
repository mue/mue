import React from 'react';

import Background from './components/widgets/background/Background';
import Widgets from './components/widgets/Widgets';
import Modals from './components/modals/Modals';

import SettingsFunctions from './modules/helpers/settings';
import { ToastContainer } from 'react-toastify';

export default class App extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      toastDisplayTime: localStorage.getItem('toastDisplayTime') || 2500
    };
  }

  componentDidMount() {
    if (!localStorage.getItem('firstRun')) {
      SettingsFunctions.setDefaultSettings();
    }

    SettingsFunctions.loadSettings();
    
    // These lines of code prevent double clicking the page or pressing CTRL + A from highlighting the page
    document.addEventListener('mousedown', (event) => {
      if (event.detail > 1) {
        event.preventDefault();
      }
    }, false);

    document.onkeydown = (e) => {
      e = e || window.event;
      if (!e.ctrlKey) return;
      let code = e.which || e.keyCode;

      switch (code) {
        case 65:
          e.preventDefault();
          e.stopPropagation();
          break;
      }
    };
  }

  render() {
    return (
      <React.Fragment>
        <Background/>
        <ToastContainer position='bottom-right' autoClose={this.state.toastDisplayTime} newestOnTop={true} closeOnClick pauseOnFocusLoss/>
        <div id='center'>
          <Widgets/>
          <Modals/>
        </div>
      </React.Fragment>
    );
  }
}
