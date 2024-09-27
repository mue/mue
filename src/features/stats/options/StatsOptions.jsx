/* eslint-disable array-callback-return */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { MdShowChart, MdRestartAlt, MdDownload, MdAccessTime, MdLock } from 'react-icons/md';
import { FaTrophy } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

import { Button } from 'components/Elements';
import { Header, CustomActions, PreferencesWrapper } from 'components/Layout/Settings';
import { ClearModal } from './ClearModal';

import { saveFile } from 'utils/saveFile';
import variables from 'config/variables';
import {
  getLocalisedAchievementData,
  achievements as initialAchievements,
  checkAchievements,
} from 'features/stats/api/achievements';

const Stats = () => {
  const [stats, setStats] = useState(() => JSON.parse(localStorage.getItem('statsData')) || {});
  const [achievements, setAchievements] = useState(initialAchievements);
  const [clearmodal, setClearmodal] = useState(false);

  const updateAchievements = useCallback(() => {
    const achieved = checkAchievements(stats);
    setAchievements(achieved);
  }, [stats]);

  useEffect(() => {
    updateAchievements();
  }, [stats, updateAchievements]);

  const getUnlockedCount = useMemo(() => {
    return achievements.filter((achievement) => achievement.achieved).length;
  }, [achievements]);

  const resetStats = () => {
    const emptyStats = {};
    localStorage.setItem('statsData', JSON.stringify(emptyStats));
    localStorage.setItem('achievements', JSON.stringify(initialAchievements));
    setStats(emptyStats);
    setClearmodal(false);
    toast(variables.getMessage('toasts.stats_reset'));
    updateAchievements(); // Call updateAchievements to refresh achievements after reset
  };

  const downloadStats = () => {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}-${date.getSeconds().toString().padStart(2, '0')}`;
    const filename = `mue_stats_${formattedDate}.json`;
    saveFile(JSON.stringify(stats, null, 2), filename);
  };

  const AchievementElement = ({ key, id, achieved, timestamp }) => {
    const { name, description } = getLocalisedAchievementData(id);

    return (
      <div className="achievement" key={key}>
        {achieved ? <FaTrophy className="trophy" /> : <MdLock className="trophyLocked" />}
        <div className={'achievementContent' + (achieved ? ' achieved' : '')}>
          {achieved && timestamp && (
            <span className="timestamp">
              <MdAccessTime /> {new Date(timestamp).toLocaleDateString()}
            </span>
          )}
          <span className="achievementTitle">{name}</span>
          <span className="subtitle">{achieved ? description : '?????'}</span>
        </div>
      </div>
    );
  };

  const StatsElement = ({ title, value }) => (
    <div>
      <span className="subtitle">{title}</span>
      <span>{value}</span>
    </div>
  );

  const STATS_SECTION = 'settings:sections.stats';

  return (
    <>
      <Header title={variables.getMessage(`${STATS_SECTION}.title`)} report={false}>
        <CustomActions>
          <Button
            type="settings"
            onClick={downloadStats}
            icon={<MdDownload />}
            label={variables.getMessage('widgets.background.download')}
          />
          <Button
            type="settings"
            onClick={() => setClearmodal(true)}
            icon={<MdRestartAlt />}
            label={variables.getMessage('settings:buttons.reset')}
          />
        </CustomActions>
      </Header>
      <Modal
        closeTimeoutMS={100}
        onRequestClose={() => setClearmodal(false)}
        isOpen={clearmodal}
        className="Modal ClearModal mainModal"
        overlayClassName="Overlay resetoverlay"
        ariaHideApp={false}
      >
        <ClearModal modalClose={() => setClearmodal(false)} resetStats={resetStats} />
      </Modal>
      <div className="modalInfoPage stats">
        <div className="statSection rightPanel">
          <div className="statIcon">
            <MdShowChart />
          </div>
          <div className="statGrid">
            <StatsElement
              title={variables.getMessage(`${STATS_SECTION}.sections.tabs_opened`)}
              value={stats['tabs-opened'] || 0}
            />
            <StatsElement
              title={variables.getMessage(`${STATS_SECTION}.sections.backgrounds_favourited`)}
              value={stats['background-favourite'] || 0}
            />
            <StatsElement
              title={variables.getMessage(`${STATS_SECTION}.sections.backgrounds_downloaded`)}
              value={stats.feature ? stats.feature['background-download'] || 0 : 0}
            />
            <StatsElement
              title={variables.getMessage(`${STATS_SECTION}.sections.quotes_favourited`)}
              value={stats.feature ? stats.feature['quoted-favourite'] || 0 : 0}
            />
            <StatsElement
              title={variables.getMessage(`${STATS_SECTION}.sections.quicklinks_added`)}
              value={stats.feature ? stats.feature['quicklink-add'] || 0 : 0}
            />
            <StatsElement
              title={variables.getMessage(`${STATS_SECTION}.sections.settings_changed`)}
              value={stats.setting ? Object.keys(stats.setting).length : 0}
            />
            <StatsElement
              title={variables.getMessage(`${STATS_SECTION}.sections.addons_installed`)}
              value={stats.marketplace?.install?.length || 0}
            />
          </div>
        </div>
        <div className="statSection leftPanel">
          <span className="title">{variables.getMessage(`${STATS_SECTION}.achievements`)}</span>
          <br />
          <span className="subtitle">
            {variables.getMessage(`${STATS_SECTION}.unlocked`, {
              count: `${getUnlockedCount}/${achievements.length}`,
            })}
          </span>
        </div>
        <div className="achievements">
          <div className="achievementsGrid">
            {achievements.map((achievement, index) => {
              if (achievement.achieved) {
                return (
                  <AchievementElement
                    key={index}
                    id={achievement.id}
                    achieved={achievement.achieved}
                    timestamp={achievement.timestamp}
                  />
                );
              }
            })}
          </div>
          <span className="title">{variables.getMessage(`${STATS_SECTION}.locked`)}</span>
          <PreferencesWrapper>
            <div className="achievementsGrid preferencesInactive">
              {achievements.map((achievement, index) => {
                if (!achievement.achieved) {
                  return (
                    <AchievementElement
                      key={index}
                      id={achievement.id}
                      achieved={achievement.achieved}
                    />
                  );
                }
              })}
            </div>
          </PreferencesWrapper>
        </div>
      </div>
    </>
  );
};

export { Stats as default, Stats };
