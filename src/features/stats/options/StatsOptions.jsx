import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  MdShowChart,
  MdRestartAlt,
  MdDownload,
  MdAccessTime,
  MdLock,
  MdError,
} from 'react-icons/md';
import { FaTrophy } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

import { Button } from 'components/Elements';
import { Header, CustomActions } from 'components/Layout/Settings';
import { ClearModal } from './ClearModal';

import { saveFile } from 'utils/saveFile';
import { formatNumber } from 'utils/formatNumber';
import { useT } from 'contexts';
import {
  getLocalisedAchievementData,
  achievements as initialAchievements,
  checkAchievements,
} from 'features/stats/api/achievements';

const Stats = () => {
  const t = useT();
  const isPreviewMode = localStorage.getItem('welcomePreview') === 'true';
  const [stats, setStats] = useState(() => JSON.parse(localStorage.getItem('statsData')) || {});
  const [achievements, setAchievements] = useState(initialAchievements);
  const [clearmodal, setClearmodal] = useState(false);

  const updateAchievements = useCallback(() => {
    setAchievements(checkAchievements(stats));
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
    localStorage.setItem('achievements', JSON.stringify([]));
    localStorage.setItem('achievementTimestamps', JSON.stringify({}));
    setStats(emptyStats);
    setAchievements(checkAchievements(emptyStats));
    setClearmodal(false);
    toast(t('toasts.stats_reset'));
  };

  const downloadStats = () => {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}-${date.getSeconds().toString().padStart(2, '0')}`;
    const filename = `mue_stats_${formattedDate}.json`;
    saveFile(JSON.stringify(stats, null, 2), filename);
  };

  const AchievementElement = ({ id, achieved, timestamp }) => {
    const [achievementData, setAchievementData] = useState({ name: '', description: '' });

    useEffect(() => {
      getLocalisedAchievementData(id).then((data) => {
        setAchievementData(data);
      });
    }, [id]);

    return (
      <div className="achievement">
        {achieved ? <FaTrophy className="trophy" /> : <MdLock className="trophyLocked" />}
        <div className={'achievementContent' + (achieved ? ' achieved' : '')}>
          {achieved && timestamp && (
            <span className="timestamp">
              <MdAccessTime /> {new Date(timestamp).toLocaleDateString()}
            </span>
          )}
          <span className="achievementTitle">{achievementData.name}</span>
          <span className="subtitle">{achieved ? achievementData.description : '?????'}</span>
        </div>
      </div>
    );
  };

  const StatsElement = ({ title, value }) => (
    <div>
      <span className="subtitle">{title}</span>
      <span>{formatNumber(value)}</span>
    </div>
  );

  const STATS_SECTION = 'modals.main.settings.sections.stats';

  if (isPreviewMode) {
    return (
      <>
        <Header title={t(`${STATS_SECTION}.title`)} report={false} />
        <div className="emptyItems">
          <div className="emptyMessage">
            <div className="loaderHolder">
              <MdError />
              <span className="title">
                {t('modals.main.settings.sections.advanced.preview_data_disabled.title')}
              </span>
              <span className="subtitle">
                {t('modals.main.settings.sections.advanced.preview_data_disabled.description')}
              </span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title={t(`${STATS_SECTION}.title`)} report={false}>
        <CustomActions>
          <Button
            type="settings"
            onClick={downloadStats}
            icon={<MdDownload />}
            label={t('widgets.background.download')}
          />
          <Button
            type="settings"
            onClick={() => setClearmodal(true)}
            icon={<MdRestartAlt />}
            label={t('modals.main.settings.buttons.reset')}
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
              title={t(`${STATS_SECTION}.sections.tabs_opened`)}
              value={stats['tabs-opened'] || 0}
            />
            <StatsElement
              title={t(`${STATS_SECTION}.sections.backgrounds_favourited`)}
              value={stats['background-favourite'] || 0}
            />
            <StatsElement
              title={t(`${STATS_SECTION}.sections.backgrounds_downloaded`)}
              value={stats.feature ? stats.feature['background-download'] || 0 : 0}
            />
            <StatsElement
              title={t(`${STATS_SECTION}.sections.quotes_favourited`)}
              value={stats.feature ? stats.feature['quoted-favourite'] || 0 : 0}
            />
            <StatsElement
              title={t(`${STATS_SECTION}.sections.quicklinks_added`)}
              value={stats.feature ? stats.feature['quicklink-add'] || 0 : 0}
            />
            <StatsElement
              title={t(`${STATS_SECTION}.sections.settings_changed`)}
              value={stats.setting ? Object.keys(stats.setting).length : 0}
            />
            <StatsElement
              title={t(`${STATS_SECTION}.sections.addons_installed`)}
              value={stats.marketplace?.install?.length || 0}
            />
          </div>
        </div>
        <div className="statSection leftPanel">
          <span className="title">{t(`${STATS_SECTION}.achievements`)}</span>
          <br />
          <span className="subtitle">
            {t(`${STATS_SECTION}.unlocked`, {
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
          <span className="title">{t(`${STATS_SECTION}.locked`)}</span>
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
        </div>
      </div>
    </>
  );
};

export { Stats as default, Stats };
