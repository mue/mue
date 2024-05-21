/* eslint-disable array-callback-return */
import variables from 'config/variables';
import { PureComponent } from 'react';
import { MdShowChart, MdRestartAlt, MdDownload, MdAccessTime, MdLock } from 'react-icons/md';
import { FaTrophy } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

import { Button } from 'components/Elements';
import { Header, CustomActions } from 'components/Layout/Settings';
import { ClearModal } from './ClearModal';

import { saveFile } from 'utils/saveFile';
import {
  getLocalisedAchievementData,
  achievements,
  checkAchievements,
} from 'features/stats/api/achievements';

class Stats extends PureComponent {
  constructor() {
    super();
    this.state = {
      stats: JSON.parse(localStorage.getItem('statsData')) || {},
      achievements,
      clearmodal: false,
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
      clearmodal: false,
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
    const achievementElement = (key, id, achieved, timestamp) => {
      const { name, description } = getLocalisedAchievementData(id);

      return (
        <div className="achievement" key={key}>
          {achieved ? <FaTrophy className="trophy" /> : <MdLock className="trophyLocked" />}
          <div className={'achievementContent' + (achieved ? ' achieved' : '')}>
            {achieved ? (
              timestamp !== undefined ? (
                <span className="timestamp">
                  <MdAccessTime /> {new Date(timestamp).toLocaleDateString()}
                </span>
              ) : null
            ) : null}
            <span className="achievementTitle">{name}</span>
            <span className="subtitle">{achieved ? description : '?????'}</span>
          </div>
        </div>
      );
    };

    const statsElement = (title, value) => {
      return (
        <div>
          <span className="subtitle">{title}</span>
          <span>{value}</span>
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
              onClick={() => this.setState({ clearmodal: true })}
              icon={<MdRestartAlt />}
              label={variables.getMessage('modals.main.settings.buttons.reset')}
            />
          </CustomActions>
        </Header>
        <Modal
          closeTimeoutMS={100}
          onRequestClose={() => this.setState({ clearmodal: false })}
          isOpen={this.state.clearmodal}
          className="Modal ClearModal mainModal"
          overlayClassName="Overlay resetoverlay"
          ariaHideApp={false}
        >
          <ClearModal
            modalClose={() => this.setState({ clearmodal: false })}
            resetStats={() => this.resetStats()}
          />
        </Modal>
        <div className="stats">
          <div className="statSection rightPanel">
            <div className="statIcon">
              <MdShowChart />
            </div>
            <div className="statGrid">
              {statsElement(
                variables.getMessage(`${STATS_SECTION}.sections.tabs_opened`),
                this.state.stats['tabs-opened'] || 0,
              )}
              {statsElement(
                variables.getMessage(`${STATS_SECTION}.sections.backgrounds_favourited`),
                this.state.stats['background-favourite'] || 0,
              )}
              {statsElement(
                variables.getMessage(`${STATS_SECTION}.sections.backgrounds_downloaded`),
                this.state.stats.feature ? this.state.stats.feature['background-download'] || 0 : 0,
              )}
              {statsElement(
                variables.getMessage(`${STATS_SECTION}.sections.quotes_favourited`),
                this.state.stats.feature ? this.state.stats.feature['quoted-favourite'] || 0 : 0,
              )}
              {statsElement(
                variables.getMessage(`${STATS_SECTION}.sections.quicklinks_added`),
                this.state.stats.feature ? this.state.stats.feature['quicklink-add'] || 0 : 0,
              )}
              {statsElement(
                variables.getMessage(`${STATS_SECTION}.sections.settings_changed`),
                this.state.stats.setting ? Object.keys(this.state.stats.setting).length : 0,
              )}
              {statsElement(
                variables.getMessage(`${STATS_SECTION}.sections.addons_installed`),
                this.state.stats.marketplace && this.state.stats.marketplace['install']
                  ? this.state.stats.marketplace['install'].length
                  : 0,
              )}
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
                console.log(achievement);
                if (achievement.achieved) {
                  return achievementElement(
                    index,
                    achievement.id,
                    achievement.achieved,
                    achievement.timestamp,
                  );
                }
              })}
            </div>
            <span className="title">{variables.getMessage(`${STATS_SECTION}.locked`)}</span>
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
