import { newAchievements, getLocalisedAchievementData } from './achievements';
import { toast } from 'react-toastify';
import variables from 'config/variables';

export default class Stats {
  static async achievementTrigger(stats) {
    const newAchievement = newAchievements(stats);
    newAchievement.forEach((achievement) => {
      if (achievement) {
        const { name } = getLocalisedAchievementData(achievement.id);
        toast.info(
          `🏆 ${variables.getMessage('settings:sections.stats.achievement_unlocked', { name: name })}`,
          {
            icon: false,
            closeButton: false,
          },
        );
      }
    });
  }

  /**
   * It takes three arguments, a type, a name, and an action, and then it increments the value of the name in the type
   * object in localStorage
   * @param type - The type of event you want to track. This can be anything you want, but I recommend
   * using something like "click" or "hover"
   * @param name - The name of the event.
   * @param action - The action of the event.
   */
  static async postEvent(type, name, action) {
    const data = JSON.parse(localStorage.getItem('statsData')) || {};

    if (!name) {
      data[type] = data[type] + 1 || 1;
    } else {
      data[type] = data[type] || {};

      if (action) {
        data[type][name] = data[type][name] || {};
        data[type][name][action] = data[type][name][action] + 1 || 1;
      } else {
        data[type][name] = data[type][name] + 1 || 1;
      }
    }

    localStorage.setItem('statsData', JSON.stringify(data));
    this.achievementTrigger(data);
  }
}
