import variables from 'modules/variables';
import { PureComponent } from 'react';
import { MdShowChart } from 'react-icons/md';

import Switch from '../Switch';
import SettingsItem from '../SettingsItem';

import EventBus from 'modules/helpers/eventbus';

export default class Stats extends PureComponent {
  constructor() {
    super();
    this.state = {
      stats: JSON.parse(localStorage.getItem('statsData')) || {},
    };
  }

  componentDidMount() {
    EventBus.on('refresh', (data) => {
      if (data === 'stats') {
        if (localStorage.getItem('stats') === 'false') {
          localStorage.setItem('statsData', JSON.stringify({}));
          return this.setState({
            stats: {},
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
    const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

    if (localStorage.getItem('stats') === 'false') {
      return (
        <>
          <span className="mainTitle">
            {getMessage('modals.main.settings.sections.stats.title')}
          </span>
          <SettingsItem
            title={getMessage('modals.main.settings.reminder.title')}
            subtitle={getMessage('modals.main.settings.sections.stats.warning')}
            final={true}
          >
            <Switch
              name="stats"
              text={getMessage('modals.main.settings.sections.stats.usage')}
              category="stats"
            />
          </SettingsItem>
        </>
      );
    }

    return (
      <>
        <span className="mainTitle">{getMessage('modals.main.settings.sections.stats.title')}</span>
        <SettingsItem
          title={getMessage('modals.main.settings.reminder.title')}
          subtitle={getMessage('modals.main.settings.sections.stats.warning')}
        >
          <Switch
            name="stats"
            text={getMessage('modals.main.settings.sections.stats.usage')}
            category="stats"
          />
        </SettingsItem>
        <div className="statsGrid">
          <div>
            <span>
              {getMessage('modals.main.settings.sections.stats.sections.tabs_opened')}:{' '}
              {this.state.stats['tabs-opened'] || 0}
            </span>
          </div>
          <div>
            <span>
              {getMessage('modals.main.settings.sections.stats.sections.tabs_opened')}:{' '}
              {this.state.stats['tabs-opened'] || 0}
            </span>
          </div>
          <div>
            <MdShowChart />
            <span className="subtitle">
              {getMessage('modals.main.settings.sections.stats.sections.tabs_opened')}{' '}
            </span>
            <span>{this.state.stats['tabs-opened'] || 0}</span>
            <span className="subtitle">
              {getMessage('modals.main.settings.sections.stats.sections.backgrounds_favourited')}{' '}
            </span>
            <span>
              {this.state.stats.feature ? this.state.stats.feature['background-favourite'] || 0 : 0}
            </span>
            <span className="subtitle">
              {getMessage('modals.main.settings.sections.stats.sections.backgrounds_downloaded')}{' '}
            </span>
            <span>
              {this.state.stats.feature ? this.state.stats.feature['background-download'] || 0 : 0}
            </span>
            <span className="subtitle">
              {getMessage('modals.main.settings.sections.stats.sections.quotes_favourited')}{' '}
            </span>
            <span>
              {this.state.stats.feature ? this.state.stats.feature['quoted-favourite'] || 0 : 0}
            </span>
            <span className="subtitle">
              {getMessage('modals.main.settings.sections.stats.sections.quicklinks_added')}{' '}
            </span>
            <span>
              {this.state.stats.feature ? this.state.stats.feature['quicklink-add'] || 0 : 0}
            </span>
            <span className="subtitle">
              {getMessage('modals.main.settings.sections.stats.sections.settings_changed')}{' '}
            </span>
            <span>
              {this.state.stats.setting ? Object.keys(this.state.stats.setting).length : 0}
            </span>
            <span className="subtitle">
              {getMessage('modals.main.settings.sections.stats.sections.addons_installed')}{' '}
            </span>
            <span>
              {this.state.stats.marketplace ? this.state.stats.marketplace['install'] : 0}
            </span>
          </div>
        </div>
      </>
    );
  }
}
