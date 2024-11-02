import { achievements } from './index';

export function checkAchievements(stats) {
  achievements.forEach((achievement) => {
    switch (achievement.condition.type) {
      case 'tabsOpened':
        if (stats['tabs-opened']?.count >= achievement.condition.amount) {
          achievement.achieved = true;
        }
        break;
      case 'addonInstall':
        if (stats.marketplace) {
          if (stats.marketplace['install']?.count >= achievement.condition.amount) {
            achievement.achieved = true;
          }
        }
        break;
      default:
        break;
    }
  });

  return achievements;
}

export function newAchievements(stats) {
  // calculate new achievements
  const oldAchievements = JSON.parse(localStorage.getItem('achievements')) || [];
  const checkedAchievements = checkAchievements(stats);
  const newAchievements = [];

  checkedAchievements.forEach((achievement) => {
    if (achievement.achieved && !oldAchievements.some((a) => a.id === achievement.id)) {
      newAchievements.push(achievement);
    }
  });

  // add timestamp to new achievements
  newAchievements.forEach((achievement) => {
    achievement.timestamp = new Date().toISOString();
  });

  // save new achievements to local storage
  localStorage.setItem('achievements', JSON.stringify([...oldAchievements, ...newAchievements]));

  return newAchievements;
}
