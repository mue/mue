import { useState, useEffect, useCallback, useMemo } from 'react';
import { MdShowChart, MdRestartAlt, MdDownload } from 'react-icons/md';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

import { Button } from 'components/Elements';
import { Header, CustomActions } from 'components/Layout/Settings';
import { StatsOverview } from './sections/StatsOverview';
import { ClearModal } from './ClearModal';
import Achievements from './sections/Achievements';
import StatsDashboard from './sections/StatsDashboard';
import SessionStats from '../components/SessionStats';

import { saveFile } from 'utils/saveFile';
import variables from 'config/variables';
import {
  achievements as initialAchievements,
  checkAchievements,
} from 'features/stats/api/achievements';
import { clearAchievements } from 'utils/indexedDB';

const Stats = () => {
  const [stats, setStats] = useState(() => JSON.parse(localStorage.getItem('statsData')) || {});
  const [achievements, setAchievements] = useState(
    () => JSON.parse(localStorage.getItem('achievements')) || initialAchievements,
  );
  const [clearmodal, setClearmodal] = useState(false);

  const updateAchievements = useCallback(async () => {
    const { updatedAchievements } = await checkAchievements(); // Destructure the result
    setAchievements(updatedAchievements); // Use the updatedAchievements array
  }, []);

  useEffect(() => {
    updateAchievements();
  }, [stats, updateAchievements]);

  const getUnlockedCount = useMemo(() => {
    return achievements.filter((achievement) => achievement.achieved).length;
  }, [achievements]);

  const resetStats = async () => {
    const emptyStats = {
      level: 1,
      totalXp: 0,
      currentLevelXp: 0,
      nextLevelXp: 100,
      streak: { current: 0 },
    };
    localStorage.setItem('statsData', JSON.stringify(emptyStats));
    localStorage.setItem('eventLog', JSON.stringify([]));
    await clearAchievements(); // Clear achievements from IndexedDB
    setStats(emptyStats);
    setClearmodal(false);
    toast(variables.getMessage('toasts.stats_reset'));
    updateAchievements();
    Stats.clearSessionStats();
  };

  const downloadStats = () => {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}-${date.getSeconds().toString().padStart(2, '0')}`;
    const filename = `mue_stats_${formattedDate}.json`;
    saveFile(JSON.stringify(stats, null, 2), filename);
  };

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
      <StatsOverview stats={stats} />
      <Achievements
        achievements={achievements}
        getUnlockedCount={getUnlockedCount}
        STATS_SECTION={STATS_SECTION}
        variables={variables}
      />
      <StatsDashboard stats={stats} variables={variables} STATS_SECTION={STATS_SECTION} />
      <div className="stats-section">
        <SessionStats />
      </div>
    </>
  );
};

export { Stats as default, Stats };
