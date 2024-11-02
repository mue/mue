import { useState, useEffect, useCallback, useMemo } from 'react';
import { MdShowChart, MdRestartAlt, MdDownload } from 'react-icons/md';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

import { Button } from 'components/Elements';
import { Header, CustomActions } from 'components/Layout/Settings';
import { StatsOverview } from './sections/StatsOverview';
import { ClearModal } from './ClearModal';
import Achievements from './sections/Achievements';

import { saveFile } from 'utils/saveFile';
import variables from 'config/variables';
import {
  achievements as initialAchievements,
  checkAchievements,
} from 'features/stats/api/achievements';

const Stats = () => {
  const [stats, setStats] = useState(() => JSON.parse(localStorage.getItem('statsData')) || {});
  const [achievements, setAchievements] = useState(
    () => JSON.parse(localStorage.getItem('achievements')) || initialAchievements,
  );
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

  const StatsElement = ({ title, value }) => (
    <div>
      <span className="subtitle">{title}</span>
      <span>{value}</span>
    </div>
  );

  const STATS_SECTION = 'settings:sections.stats';

  return (
    <>
      {/* <Header title={variables.getMessage(`${STATS_SECTION}.title`)} report={false}>
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
      </Header> */}
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
      <StatsOverview stats={stats} />
      <Achievements
        achievements={achievements}
        getUnlockedCount={getUnlockedCount}
        STATS_SECTION={STATS_SECTION}
        variables={variables}
      />
      <span class="text-2xl font-semibold pb-5">Statistics</span>
      <div className="modalInfoPage stats">
        <div className="statSection rightPanel">
          <div className="statIcon">
            <MdShowChart />
          </div>
          <div className="statGrid">
            <StatsElement
              title={variables.getMessage(`${STATS_SECTION}.sections.tabs_opened`)}
              value={stats['tabs-opened']?.count || 0}
            />
            <StatsElement
              title={variables.getMessage(`${STATS_SECTION}.sections.backgrounds_favourited`)}
              value={stats['background-favourite']?.count || 0}
            />
            <StatsElement
              title={variables.getMessage(`${STATS_SECTION}.sections.backgrounds_downloaded`)}
              value={stats['background-download']?.count || 0}
            />
            <StatsElement
              title={variables.getMessage(`${STATS_SECTION}.sections.quotes_favourited`)}
              value={stats['quoted-favourite']?.count || 0}
            />
            <StatsElement
              title={variables.getMessage(`${STATS_SECTION}.sections.quicklinks_added`)}
              value={stats['quicklink-add']?.count || 0}
            />
            <StatsElement
              title={variables.getMessage(`${STATS_SECTION}.sections.settings_changed`)}
              value={stats.setting ? Object.keys(stats.setting).length : 0}
            />
            <StatsElement
              title={variables.getMessage(`${STATS_SECTION}.sections.addons_installed`)}
              value={stats.marketplace?.install?.length || 0}
            />
            <StatsElement
              title="XP Level"
              value={`${stats.level || 1} (${stats.xp || 0}/${stats.nextLevelXp || 100} XP)`}
            />
            <StatsElement title="Total XP" value={`${stats.totalXp || 0} XP`} />
            <StatsElement title="Streak" value={`${stats.streak?.current || 0} days`} />
          </div>
        </div>
      </div>
    </>
  );
};

export { Stats as default, Stats };
