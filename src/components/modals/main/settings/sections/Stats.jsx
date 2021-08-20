import { PureComponent } from 'react';

import Switch from '../Switch';

import EventBus from '../../../../../modules/helpers/eventbus';

export default class Stats extends PureComponent {
  constructor() {
    super();
    this.state = {
      stats: JSON.parse(localStorage.getItem('statsData')) || {}
    };
    this.language = window.language.modals.main.settings.sections.stats;
  }

  componentDidMount() { 
    EventBus.on('refresh', (data) => { 
      if (data === 'stats') {
        if (localStorage.getItem('stats') === 'false') {
          localStorage.setItem('statsData', JSON.stringify({}));
          return this.setState({
            stats: {}
          });
        }
        this.forceUpdate();
      }
    });
  }

  componentWillUnmount() {
    EventBus.off('refresh');
  }

  render() {
    if (localStorage.getItem('stats') === 'false') {
      return (
        <>
          <h2>{window.language.modals.main.settings.reminder.title}</h2>
          <p>{this.language.warning}</p>
          <Switch name='stats' text={this.language.usage} category='stats'/>
        </>
      );
    }

    return (
      <>
        <h2>{this.language.title}</h2>
        <p>{this.language.sections.tabs_opened}: {this.state.stats['tabs-opened'] || 0}</p>
        <p>{this.language.sections.backgrounds_favourited}: {this.state.stats.feature ? this.state.stats.feature['background-favourite'] || 0 : 0}</p>
        <p>{this.language.sections.backgrounds_downloaded}: {this.state.stats.feature ? this.state.stats.feature['background-download'] || 0 : 0}</p>
        <p>{this.language.sections.quotes_favourited}: {this.state.stats.feature ? this.state.stats.feature['quoted-favourite'] || 0 : 0}</p>
        <p>{this.language.sections.quicklinks_added}: {this.state.stats.feature ? this.state.stats.feature['quicklink-add'] || 0 : 0}</p>
        <p>{this.language.sections.settings_changed}: {this.state.stats.setting ? Object.keys(this.state.stats.setting).length : 0}</p>
        <p>{this.language.sections.addons_installed}: {this.state.stats.marketplace ? this.state.stats.marketplace['install'] : 0}</p>
        <Switch name='stats' text={this.language.usage} category='stats'/>
        <p>{this.language.disable}</p>
      </>
    );
  }
}
