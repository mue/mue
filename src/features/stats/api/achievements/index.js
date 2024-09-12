import variables from 'config/variables';
import achievements from '../../achievements.json';
import { checkAchievements, newAchievements } from './condition';

function getLocalisedAchievementData(id) {
  return {
    name: variables.getMessage(`achievements:${id}.name`),
    description: variables.getMessage(`achievements:${id}.description`)
  };
}

export { achievements, checkAchievements, newAchievements, getLocalisedAchievementData };
