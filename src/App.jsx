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
  }

  render() {
    return (
      <>
        <Background/>
        <ToastContainer position='bottom-right' autoClose={this.state.toastDisplayTime} newestOnTop={true} closeOnClick pauseOnFocusLoss/>
        <div id='center'>
          <Widgets/>
          <Modals/>
        </div>
      </>
    );
  }
}
