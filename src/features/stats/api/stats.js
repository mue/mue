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

  static calculateNextLevelXp(level) {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  }

  static calculateXpForEvent(eventType, streak) {
    let baseXp = 10; // Base XP for an event
    if (eventType === 'tabs-opened') {
      baseXp = 5;
    }
    return baseXp * (1 + streak * 0.1); // Increase XP by 10% for each day in the streak
  }

  static async postEvent(type, name = '', action = '') {
    const data = JSON.parse(localStorage.getItem('statsData')) || {};
    const timestamp = new Date().toISOString();

    console.log(`Event Type: ${type}`);
    console.log(`Event Name: ${name}`);
    console.log(`Event Action: ${action}`);

    if (!data[type]) {
      data[type] = { count: 0, events: [] };
    }

    data[type].count += 1;
    data[type].events.push({ name, action, timestamp });

    // Calculate XP and level
    const streak = data.streak?.current || 0;
    const lastEventTimestamp = data[type].events[data[type].events.length - 2]?.timestamp;
    const lastEventDate = lastEventTimestamp ? new Date(lastEventTimestamp).toDateString() : null;
    const currentEventDate = new Date(timestamp).toDateString();

    if (lastEventDate && lastEventDate !== currentEventDate) {
      const daysDifference =
        (new Date(currentEventDate) - new Date(lastEventDate)) / (1000 * 60 * 60 * 24);
      if (daysDifference === 1) {
        data.streak = { current: streak + 1 };
      } else {
        data.streak = { current: 1 };
      }
    } else if (!lastEventDate) {
      data.streak = { current: 1 };
    }

    const xpGained = this.calculateXpForEvent(type, data.streak.current);
    data.totalXp = (data.totalXp || 0) + xpGained;
    data.xp = (data.xp || 0) + xpGained;
    data.nextLevelXp = data.nextLevelXp || this.calculateNextLevelXp(data.level || 1);

    console.log(`XP Gained for ${type}: ${xpGained}`);
    console.log(`Total XP: ${data.totalXp}`);
    console.log(`Current Level XP: ${data.xp}`);
    console.log(`Next Level XP: ${data.nextLevelXp}`);
    console.log(`Current Streak: ${data.streak.current}`);

    while (data.xp >= data.nextLevelXp) {
      data.xp -= data.nextLevelXp;
      data.level = (data.level || 1) + 1;
      data.nextLevelXp = this.calculateNextLevelXp(data.level);
      toast.info(`🎉 Level Up ${data.level}`, {
        icon: false,
        closeButton: false,
      });
    }

    localStorage.setItem('statsData', JSON.stringify(data));
    this.achievementTrigger(data);
  }
}
