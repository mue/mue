/* eslint-disable array-callback-return */
import variables from 'config/variables';
import { PureComponent } from 'react';
import { MdShowChart, MdRestartAlt, MdDownload } from 'react-icons/md';
import { FaTrophy } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { Button } from 'components/Elements';
import Header, { CustomActions } from '../Header';

import { saveFile } from 'modules/helpers/settings/modals';

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
  pt_BR: translations.pt_BR,
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

  downloadStats() {
    let date = new Date();
    // Format the date as YYYY-MM-DD_HH-MM-SS
    let formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}-${date.getSeconds().toString().padStart(2, '0')}`;
    let filename = `mue_stats_${formattedDate}.json`;
    saveFile(JSON.stringify(this.state.stats, null, 2), filename);
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

    const STATS_SECTION = 'modals.main.settings.sections.stats';

    return (
      <>
        <Header title={variables.getMessage(`${STATS_SECTION}.title`)} report={false}>
          <CustomActions>
            <Button
              type="settings"
              onClick={() => this.downloadStats()}
              icon={<MdDownload />}
              label={variables.getMessage('widgets.background.download')}
            />
            <Button
              type="settings"
              onClick={() => this.resetStats()}
              icon={<MdRestartAlt />}
              label={variables.getMessage('modals.main.settings.buttons.reset')}
            />
          </CustomActions>
        </Header>
        <div className="stats">
          <div className="statSection rightPanel">
            <div className="statIcon">
              <MdShowChart />
            </div>
            <div className="statGrid">
              <div>
                <span className="subtitle">
                  {variables.getMessage(`${STATS_SECTION}.sections.tabs_opened`)}{' '}
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
            <span className="title">{variables.getMessage(`${STATS_SECTION}.achievements`)}</span>
            <br />
            <span className="subtitle">
              {variables.getMessage(`${STATS_SECTION}.unlocked`, {
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
