import { achievements } from './index';
import statsModule from '../stats';
import { getAchievements, saveAchievement } from 'utils/indexedDB';

export async function checkAchievements() {
  const storedAchievements = await getAchievements();
  const events = await statsModule.getStats();
  const currentTabId = statsModule.getCurrentTabId();

  // Calculate aggregated stats
  const aggregatedStats = {
    'new-tab': events.filter((event) => event.type === 'new-tab').length,
    'marketplace-install': events.filter((event) => event.type === 'marketplace-install').length,
    totalXp: events.reduce((sum, event) => sum + (event.xpGained || 0), 0),
    level: statsModule.level || 1,
  };

  const newlyAchieved = [];
  const updatedAchievements = achievements.map((achievement) => {
    const stored = storedAchievements.find((a) => a.id === achievement.id);
    if (stored && stored.achieved) {
      return stored;
    }

    let achieved = false;
    switch (achievement.condition.type) {
      case 'tabsOpened':
        achieved = aggregatedStats['new-tab'] >= achievement.condition.amount;
        break;
      case 'addonInstall':
        achieved = aggregatedStats['marketplace-install'] >= achievement.condition.amount;
        break;
      case 'reachLevel':
        achieved = aggregatedStats.level >= achievement.condition.amount;
        break;
      case 'earnXp':
        achieved = aggregatedStats.totalXp >= achievement.condition.amount;
        break;
    }

    if (achieved && !stored?.achieved) {
      const updatedAchievement = {
        ...achievement,
        achieved: true,
        timestamp: new Date().toISOString(),
        tabId: currentTabId,
      };
      newlyAchieved.push(updatedAchievement);
      saveAchievement(updatedAchievement);
      return updatedAchievement;
    }

    return achievement;
  });

  return { updatedAchievements, newlyAchieved };
}

export async function newAchievements() {
  const { updatedAchievements, newlyAchieved } = await checkAchievements();
  // Only return newly achieved achievements for toast notifications
  return newlyAchieved;
}

// Helper function to get achievement progress
export async function getAchievementProgress(achievementId) {
  const achievement = achievements.find((a) => a.id === achievementId);
  if (!achievement) return null;

  const events = await statsModule.getStats();
  let current = 0;

  switch (achievement.condition.type) {
    case 'tabsOpened':
      current = events.filter((event) => event.type === 'new-tab').length;
      break;
    case 'addonInstall':
      current = events.filter((event) => event.type === 'marketplace-install').length;
      break;
    case 'reachLevel':
      current = statsModule.level || 1;
      break;
    case 'earnXp':
      current = events.reduce((sum, event) => sum + (event.xpGained || 0), 0);
      break;
  }

  return {
    current,
    required: achievement.condition.amount,
    percentage: Math.min(100, Math.floor((current / achievement.condition.amount) * 100)),
  };
}
