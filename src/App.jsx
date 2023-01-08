import variables from 'modules/variables';
import { PureComponent } from 'react';
import { ToastContainer } from 'react-toastify';

import Background from 'components/widgets/background/Background';
import Widgets from 'components/widgets/Widgets';
import Modals from 'components/modals/Modals';

import { loadSettings, moveSettings } from 'modules/helpers/settings';

import EventBus from 'modules/helpers/eventbus';

export default class App extends PureComponent {
  componentDidMount() {
    // 4.0 -> 5.0 (the key below is only on 5.0)
    // now featuring 5.0 -> 5.1
    // the firstRun check was moved here because the old function was useless
    if (!localStorage.getItem('firstRun') || !localStorage.getItem('stats')) {
      moveSettings();
      window.location.reload();
    }

    loadSettings();

    EventBus.on('refresh', (data) => {
      if (data === 'other') {
        loadSettings(true);
      }
    });

    variables.stats.tabLoad();
  }

  componentWillUnmount() {
    EventBus.off('refresh');
  }

  render() {
    return (
      <>
        {localStorage.getItem('background') === 'true' ? <Background /> : null}
        <ToastContainer
          position="bottom-right"
          autoClose={localStorage.getItem('toastDisplayTime') || 2500}
          newestOnTop={true}
          closeOnClick
          pauseOnFocusLoss
        />
        <div id="center">
          <Widgets />
          <Modals />
        </div>
      </>
    );
  }
}
