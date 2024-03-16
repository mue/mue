/* eslint-disable array-callback-return */
import variables from 'config/variables';
import { PureComponent } from 'react';
import { MdShowChart, MdRestartAlt, MdDownload } from 'react-icons/md';
import { FaTrophy } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { Button } from 'components/Elements';
import { Header, CustomActions } from 'components/Layout/Settings';

import { saveFile } from 'utils/saveFile';

import { getLocalisedAchievementData, achievements, checkAchievements } from 'utils/achievements';

class Stats extends PureComponent {
  constructor() {
    super();
    this.state = {
      stats: JSON.parse(localStorage.getItem('statsData')) || {},
      achievements,
    };
  }

  updateAchievements() {
    const achieved = checkAchievements(this.state.stats);
    this.setState({
      achievements: achieved,
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
    localStorage.setItem('achievements', JSON.stringify(achievements));
    this.setState({
      stats: {},
      achievements,
    });
    toast(variables.getMessage('toasts.stats_reset'));
    this.updateAchievements();
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
    this.updateAchievements();
    this.forceUpdate();
  }

  render() {
    const achievementElement = (key, id, achieved) => {
      const { name, description } = getLocalisedAchievementData(id);

      return (
        <div className="achievement" key={key}>
          <FaTrophy />
          <div className={'achievementContent' + (achieved ? ' achieved' : '')}>
            <span>{name}</span>
            <span className="subtitle">{achieved ? description : '?????'}</span>
          </div>
        </div>
      );
    };

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
            <div className="achievementsGrid">
              {this.state.achievements.map((achievement, index) => {
                if (achievement.achieved) {
                  return achievementElement(index, achievement.id, achievement.achieved);
                }
              })}
            </div>
            <span className="title">Locked</span>
            <div className="achievementsGrid preferencesInactive">
              {this.state.achievements.map((achievement, index) => {
                if (!achievement.achieved) {
                  return achievementElement(index, achievement.id, achievement.achieved);
                }
              })}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export { Stats as default, Stats };
