/* eslint-disable array-callback-return */
import variables from 'modules/variables';
import { PureComponent } from 'react';
import { MdShowChart, MdRestartAlt } from 'react-icons/md';
import { FaTrophy } from 'react-icons/fa';
import { toast } from 'react-toastify';

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
  bn: translations.bn,
};

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

  resetStats() {
    localStorage.setItem('statsData', JSON.stringify({}));
    this.setState({
      stats: {},
    });
    toast('Stats reset');
    this.getAchievements();
    this.forceUpdate();
  }

  componentDidMount() {
    this.getAchievements();
    this.forceUpdate();
  }

  render() {
    const achievementElement = (key, name, achieved) => (
      <div className="achievement">
        <FaTrophy />
        <div className={'achievementContent' + (achieved ? ' achieved' : '')}>
          <span>{name}</span>
          <span className="subtitle">
            {achievementLanguage[localStorage.getItem('language')][key]}
          </span>
        </div>
      </div>
    );

    return (
      <>
        <div className="statsTopBar">
          <span className="mainTitle">
            {variables.getMessage('modals.main.settings.sections.stats.title')}
          </span>
          <div className="statsReset">
            <button onClick={() => this.resetStats()}>
              <MdRestartAlt /> {variables.getMessage('modals.main.settings.buttons.reset')}
            </button>
          </div>{' '}
        </div>
        <div className="stats">
          <div className="statSection rightPanel">
            <div className="statIcon">
              <MdShowChart />
            </div>
            <div className="statGrid">
              <div>
                <span className="subtitle">
                  {variables.getMessage('modals.main.settings.sections.stats.sections.tabs_opened')}{' '}
                </span>
                <span>{this.state.stats['tabs-opened'] || 0}</span>
              </div>
              <div>
                <span className="subtitle">
                  {variables.getMessage(
                    'modals.main.settings.sections.stats.sections.backgrounds_favourited',
                  )}{' '}
                </span>
                <span>
                  {this.state.stats.feature
                    ? this.state.stats.feature['background-favourite'] || 0
                    : 0}
                </span>
              </div>
              <div>
                <span className="subtitle">
                  {variables.getMessage(
                    'modals.main.settings.sections.stats.sections.backgrounds_downloaded',
                  )}{' '}
                </span>
                <span>
                  {this.state.stats.feature
                    ? this.state.stats.feature['background-download'] || 0
                    : 0}
                </span>
              </div>
              <div>
                <span className="subtitle">
                  {variables.getMessage(
                    'modals.main.settings.sections.stats.sections.quotes_favourited',
                  )}{' '}
                </span>
                <span>
                  {this.state.stats.feature ? this.state.stats.feature['quoted-favourite'] || 0 : 0}
                </span>
              </div>
              <div>
                <span className="subtitle">
                  {variables.getMessage(
                    'modals.main.settings.sections.stats.sections.quicklinks_added',
                  )}{' '}
                </span>
                <span>
                  {this.state.stats.feature ? this.state.stats.feature['quicklink-add'] || 0 : 0}
                </span>
              </div>
              <div>
                <span className="subtitle">
                  {variables.getMessage(
                    'modals.main.settings.sections.stats.sections.settings_changed',
                  )}{' '}
                </span>
                <span>
                  {this.state.stats.setting ? Object.keys(this.state.stats.setting).length : 0}
                </span>
              </div>
              <div>
                <span className="subtitle">
                  {variables.getMessage(
                    'modals.main.settings.sections.stats.sections.addons_installed',
                  )}{' '}
                </span>
                <span>
                  {this.state.stats.marketplace ? this.state.stats.marketplace['install'] : 0}
                </span>
              </div>
            </div>
          </div>
          <div className="statSection leftPanel">
            <span className="title">
              {variables.getMessage('modals.main.settings.sections.stats.achievements')}
            </span>
            <br />
            <span className="subtitle">
              {variables.getMessage('modals.main.settings.sections.stats.unlocked', {
                count: this.getUnlockedCount() + '/' + this.state.achievements.length,
              })}
            </span>
          </div>
          <div className="achievements">
            {this.state.achievements.map((achievement, index) => {
              if (achievement.achieved) {
                return achievementElement(index, achievement.name, achievement.achieved);
              }
            })}
          </div>
        </div>
      </>
    );
  }
}
