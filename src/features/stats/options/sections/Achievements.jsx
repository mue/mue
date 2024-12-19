import React, { useState, useEffect } from 'react';
import { FaTrophy } from 'react-icons/fa';
import { MdAccessTime, MdLock } from 'react-icons/md';
import { PreferencesWrapper } from 'components/Layout/Settings';
import { getLocalisedAchievementData } from 'features/stats/api/achievements';
import { achievements as initialAchievements } from 'features/stats/api/achievements';
import { motion } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const AchievementElement = ({ achievementKey, id, achieved, timestamp }) => {
  if (!id) {
    return null; // Ensure id is not undefined
  }

  const { name, description } = getLocalisedAchievementData(id);

  return (
    <div
      className="relative flex items-center gap-6 p-6 rounded-xl backdrop-blur-sm bg-neutral-900/30 border border-neutral-800/50 
                 hover:bg-neutral-800/40 transition-all duration-300 group overflow-hidden
                 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] cursor-pointer"
      key={achievementKey}
    >
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                      ${achieved ? 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10' : 'bg-gradient-to-r from-neutral-700/10 to-neutral-600/10'}`}
      />
      <div
        className={`relative flex-shrink-0 p-3 rounded-lg 
                      ${achieved ? 'bg-gradient-to-br from-yellow-500/20 to-amber-600/20' : 'bg-neutral-800/50'} 
                      shadow-xl transition-transform duration-300 group-hover:scale-110`}
      >
        {achieved ? (
          <FaTrophy className="w-8 h-8 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]" />
        ) : (
          <MdLock className="w-8 h-8 text-neutral-400" />
        )}
      </div>
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-center">
          <span
            className={`text-lg font-bold tracking-tight
                          ${achieved ? 'text-neutral-100' : 'text-neutral-400'}`}
          >
            {name}
          </span>
          {achieved && timestamp && (
            <span className="text-xs text-neutral-500 flex items-center gap-1 bg-neutral-800/50 px-2 py-1 rounded-full">
              <MdAccessTime className="w-3 h-3" />
              {new Date(timestamp).toLocaleDateString()}
            </span>
          )}
        </div>
        <span className="text-sm text-neutral-400 leading-relaxed relative group-hover:text-neutral-300 transition-colors duration-300">
          {achieved ? description : '?????'}
        </span>
      </div>
    </div>
  );
};

const Achievements = ({ achievements, getUnlockedCount, STATS_SECTION, variables }) => {
  const [showLocked, setShowLocked] = useState(false);
  const [allAchievements, setAllAchievements] = useState([]);

  useEffect(() => {
    // Combine stored achievements with initial achievements to ensure we have all of them
    const combineAchievements = () => {
      // Start with all possible achievements
      const combined = initialAchievements.map((achievement) => {
        // Find if this achievement exists in the provided achievements array
        const stored = achievements.find((a) => a.id === achievement.id);
        if (stored) {
          // If it exists in stored achievements, use that data
          return stored;
        }
        // If it doesn't exist in stored achievements, use the initial data
        return {
          ...achievement,
          achieved: false,
        };
      });
      setAllAchievements(combined);
    };

    combineAchievements();
  }, [achievements]);

  const totalAchievements = initialAchievements.length; // Get total from initial achievements

  return (
    <div className="achievementsSection">
      <div className="flex flex-row justify-between items-center py-5">
        <span className="text-2xl font-semibold">
          {variables.getMessage(`${STATS_SECTION}.achievements`)}
        </span>
        <span className="text-neutral-200">
          {variables.getMessage(`${STATS_SECTION}.unlocked`, {
            count: `${getUnlockedCount}/${totalAchievements}`, // Use total from initialAchievements
          })}
        </span>
      </div>
      <div className="achievements">
        <div className="achievementsGrid">
          {allAchievements.map((achievement, index) => {
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
          onClick={() => setShowLocked(!showLocked)}
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
            {allAchievements.map((achievement, index) => {
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
