import { achievements } from './index';
import statsModule from '../stats';

export async function checkAchievements() {
  // First get the events data which contains all user actions
  const events = await statsModule.getStats();

  // Calculate aggregated stats
  const aggregatedStats = {
    'new-tab': events.filter((event) => event.type === 'new-tab').length,
    'marketplace-install': events.filter((event) => event.type === 'marketplace-install').length,
    totalXp: events.reduce((sum, event) => sum + (event.xpGained || 0), 0),
    level: statsModule.level || 1,
  };

  console.log('Checking achievements with aggregated stats:', aggregatedStats);

  achievements.forEach((achievement) => {
    switch (achievement.condition.type) {
      case 'tabsOpened':
        console.log(
          `Checking achievement: ${achievement.id}, Condition: ${achievement.condition.type}, Required: ${achievement.condition.amount}, Current: ${aggregatedStats['new-tab']}`,
        );
        if (aggregatedStats['new-tab'] >= achievement.condition.amount) {
          achievement.achieved = true;
        }
        break;

      case 'addonInstall':
        console.log(
          `Checking achievement: ${achievement.id}, Condition: ${achievement.condition.type}, Required: ${achievement.condition.amount}, Current: ${aggregatedStats['marketplace-install']}`,
        );
        if (aggregatedStats['marketplace-install'] >= achievement.condition.amount) {
          achievement.achieved = true;
        }
        break;

      case 'reachLevel':
        console.log(
          `Checking achievement: ${achievement.id}, Condition: ${achievement.condition.type}, Required: ${achievement.condition.amount}, Current: ${aggregatedStats.level}`,
        );
        if (aggregatedStats.level >= achievement.condition.amount) {
          achievement.achieved = true;
        }
        break;

      case 'earnXp':
        console.log(
          `Checking achievement: ${achievement.id}, Condition: ${achievement.condition.type}, Required: ${achievement.condition.amount}, Current: ${aggregatedStats.totalXp}`,
        );
        if (aggregatedStats.totalXp >= achievement.condition.amount) {
          achievement.achieved = true;
        }
        break;

      default:
        console.warn(`Unknown achievement condition type: ${achievement.condition.type}`);
        break;
    }
  });

  return achievements;
}

export async function newAchievements() {
  // Get previously achieved achievements
  const oldAchievements = JSON.parse(localStorage.getItem('achievements')) || [];

  // Check for new achievements
  const checkedAchievements = await checkAchievements();
  const newAchievements = [];

  checkedAchievements.forEach((achievement) => {
    const isNewAchievement =
      achievement.achieved && !oldAchievements.some((a) => a.id === achievement.id);

    if (isNewAchievement) {
      const newAchievement = {
        ...achievement,
        timestamp: new Date().toISOString(),
      };
      newAchievements.push(newAchievement);
    }
  });

  // Update stored achievements
  if (newAchievements.length > 0) {
    const updatedAchievements = [...oldAchievements, ...newAchievements];
    localStorage.setItem('achievements', JSON.stringify(updatedAchievements));
  }

  return newAchievements;
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
