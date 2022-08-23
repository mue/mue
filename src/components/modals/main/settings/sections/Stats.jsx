/* eslint-disable array-callback-return */
import variables from 'modules/variables';
import { PureComponent } from 'react';
import { MdShowChart } from 'react-icons/md';

import Switch from '../Switch';
import SettingsItem from '../SettingsItem';
import { FaTrophy } from 'react-icons/fa';

import EventBus from 'modules/helpers/eventbus';
import achievementsData from 'modules/helpers/settings/achievements.json';
import translations from 'modules/helpers/settings/achievement_translations/index';

const achievementLanguage = {
  de_DE: translations.de_DE,
  en_GB: translations.en_GB,
  en_US: translations.en_US,
  es: translations.es,
  fr: translations.fr,
  nl: translations.nl,
  no: translations.no,
  ru: translations.ru,
  zh_CN: translations.zh_CN,
  id_ID: translations.id_ID,
  tr_TR: translations.tr_TR,
};

console.log(achievementLanguage.en_GB);

export default class Stats extends PureComponent {
  constructor() {
    super();
    this.state = {
      stats: JSON.parse(localStorage.getItem('statsData')) || {},
      achievements: achievementsData.achievements,
    };
  }

  getAchievements() {
    const achievements = this.state.achievements;
    achievements.forEach((achievement) => {
      switch (achievement.condition.type) {
        case 'tabsOpened':
          if (this.state.stats['tabs-opened'] >= achievement.condition.amount) {
            achievement.achieved = true;
          }
          break;
        case 'addonInstall':
          if (this.state.stats.marketplace) {
            if (this.state.stats.marketplace['install'] >= achievement.condition.amount) {
              achievement.achieved = true;
            }
          }
          break;
        default:
          break;
      }
    });

    this.setState({
      achievements,
    });
  }

  getUnlockedCount() {
    let count = 0;
    this.state.achievements.forEach((achievement) => {
      if (achievement.achieved) {
        count++;
      }
    });
    return count;
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

    this.getAchievements();
    this.forceUpdate();
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

    const achievementElement = (key, name) => (
      <div className="achievement">
        <FaTrophy />
        <div className="achievementContent">
          <span>{name}</span>
          <span className="subtitle">
            {achievementLanguage[localStorage.getItem('language')][key]}
          </span>
        </div>
      </div>
    );

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
          <div className="statSection leftPanel">
            <span className="title">
              {getMessage('modals.main.settings.sections.stats.achievements')}
            </span>
            <br />
            <span className="subtitle">
              {variables.language.getMessage(
                variables.languagecode,
                'modals.main.settings.sections.stats.unlocked',
                {
                  count: this.getUnlockedCount() + '/' + this.state.achievements.length,
                },
              )}
            </span>
            <div className="achievements">
              {this.state.achievements.map((achievement, index) => {
                if (achievement.achieved) {
                  return achievementElement(index, achievement.name);
                }
              })}
            </div>
          </div>
          <div className="statSection rightPanel">
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
