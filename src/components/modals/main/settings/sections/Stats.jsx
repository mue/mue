import React from 'react';

import Switch from '../Switch';

import EventBus from '../../../../../modules/helpers/eventbus';

export default class Stats extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      stats: JSON.parse(localStorage.getItem('statsData')) || {}
    };
  }

  componentDidMount() { 
    EventBus.on('refresh', (data) => { 
      if (data === 'stats') {
        if (localStorage.getItem('stats') === 'false') {
          localStorage.setItem('statsData', JSON.stringify({}));
          return this.setState({
            stats: JSON.parse(localStorage.getItem('statsData')) || {}
          });
        }
        this.forceUpdate();
      }
    })
  }

  render() {
    if (localStorage.getItem('stats') === 'false') {
        return (
          <>
            <h2>Notice</h2>
            <p>You need to enable usage data in order to use this feature</p>
            <Switch name='stats' text='Usage Stats' category='stats'/>
          </>
        );
    }

    return (
      <>
        <h2>Stats</h2>
        <p>Tabs opened: {this.state.stats['tabs-opened'] || 0}</p>
        <p>Backgrounds favourited: {this.state.stats.feature ? this.state.stats.feature['background-favourite'] || 0 : 0}</p>
        <p>Backgrounds downloaded: {this.state.stats.feature ? this.state.stats.feature['background-download'] || 0 : 0}</p>
        <p>Quotes favourited: {this.state.stats.feature ? this.state.stats.feature['quoted-favourite'] || 0 : 0}</p>
        <p>Settings changed: {this.state.stats.setting ? Object.keys(this.state.stats.setting).length : 0}</p>
        <Switch name='stats' text='Usage Stats' category='stats'/>
        <p>Turning this off will clear your statistics locally, but will not delete the anonymous data posted to umami.</p>
      </>
    );
  }
}
