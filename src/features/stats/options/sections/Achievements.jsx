import React, { useState } from 'react';
import { FaTrophy } from 'react-icons/fa';
import { MdAccessTime, MdLock } from 'react-icons/md';
import { PreferencesWrapper } from 'components/Layout/Settings';
import { getLocalisedAchievementData } from 'features/stats/api/achievements';
import { motion } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const AchievementElement = ({ achievementKey, id, achieved, timestamp }) => {
  if (!id) {
    return null; // Ensure id is not undefined
  }

  const { name, description } = getLocalisedAchievementData(id);

  return (
    <div className="achievement" key={achievementKey}>
      {achieved ? (
        <FaTrophy className="trophy flex-shrink-0" />
      ) : (
        <MdLock className="trophyLocked flex-shrink-0" />
      )}
      <div className={'achievementContent' + (achieved ? ' achieved' : '')}>
        {achieved && timestamp && (
          <span className="timestamp">
            <MdAccessTime /> {new Date(timestamp).toLocaleDateString()}
          </span>
        )}
        <span className="text-base">{name}</span>
        <span className="text-xs text-neutral-400 leading-tight lowercase">
          {achieved ? description : '?????'}
        </span>
      </div>
    </div>
  );
};

const Achievements = ({ achievements, getUnlockedCount, STATS_SECTION, variables }) => {
  const [showLocked, setShowLocked] = useState(false);

  const toggleLocked = () => {
    setShowLocked(!showLocked);
  };

  return (
    <div className="achievementsSection">
      <div className="flex flex-row justify-between items-center py-5">
        <span className="text-2xl font-semibold">
          {variables.getMessage(`${STATS_SECTION}.achievements`)}
        </span>
        <span className="text-neutral-200">
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
                  achievementKey={index}
                  id={achievement.id}
                  achieved={achievement.achieved}
                  timestamp={achievement.timestamp}
                />
              );
            }
            return null; // Ensure a value is returned
          })}
        </div>
        <div
          className="flex flex-row justify-between items-center py-5 cursor-pointer"
          onClick={toggleLocked}
        >
          <span className="text-xl font-semibold">
            {variables.getMessage(`${STATS_SECTION}.locked`)}
          </span>
          <span className="text-neutral-200">
            {showLocked ? <FaChevronUp /> : <FaChevronDown />}
          </span>
        </div>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: showLocked ? 'auto' : 0, opacity: showLocked ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden"
        >
          <div className="achievementsGrid preferencesInactive">
            {achievements.map((achievement, index) => {
              if (!achievement.achieved) {
                return (
                  <AchievementElement
                    key={index}
                    achievementKey={index}
                    id={achievement.id}
                    achieved={achievement.achieved}
                  />
                );
              }
              return null; // Ensure a value is returned
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Achievements;
