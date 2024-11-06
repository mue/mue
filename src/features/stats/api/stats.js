import { addEvent, getEvents } from 'utils/indexedDB';
import { newAchievements, getLocalisedAchievementData } from './achievements';
import { toast } from 'react-toastify';
import variables from 'config/variables';

export default class Stats {
  static async achievementTrigger(stats) {
    const newAchievement = await newAchievements(stats);
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
    const baseXP = 100;
    const scalingFactor = 1.2;
    const softCap = 50;

    if (level <= softCap) {
      return Math.floor(baseXP * Math.pow(scalingFactor, level - 1));
    } else {
      const softCapXP = baseXP * Math.pow(scalingFactor, softCap - 1);
      const extraLevels = level - softCap;
      return Math.floor(softCapXP + baseXP * extraLevels * 0.5);
    }
  }

  static calculateXpForEvent(eventType, streak) {
    let baseXp;

    switch (eventType) {
      case 'new-tab':
        baseXp = 5;
        break;
      case 'settings-tab':
        baseXp = 1;
        break;
      case 'marketplace-install':
        baseXp = 20;
        break;
      default:
        baseXp = 10;
        break;
    }
    return Math.round(baseXp * (1 + streak * 0.1));
  }

  static async addEvent(event) {
    await addEvent(event);
  }

  static updateStatsData(statsData, xpGained) {
    statsData.totalXp += xpGained;
    statsData.currentLevelXp += xpGained;

    while (statsData.currentLevelXp >= statsData.nextLevelXp) {
      statsData.currentLevelXp -= statsData.nextLevelXp;
      statsData.level += 1;
      statsData.nextLevelXp = this.calculateNextLevelXp(statsData.level);
      toast.info(`🎉 Level Up ${statsData.level}`, {
        icon: false,
        closeButton: false,
      });
    }

    // Ensure XP values are integers
    statsData.totalXp = Math.round(statsData.totalXp);
    statsData.currentLevelXp = Math.round(statsData.currentLevelXp);

    localStorage.setItem('statsData', JSON.stringify(statsData));
  }

  static calculateStreak(data, timestamp) {
    if (!data.events || data.events.length < 2) {
      data.streak.current = 1;
      return;
    }

    const lastEventTimestamp = data.events[data.events.length - 2]?.timestamp;
    const lastEventDate = lastEventTimestamp ? new Date(lastEventTimestamp).toDateString() : null;
    const currentEventDate = new Date(timestamp).toDateString();

    if (lastEventDate && lastEventDate !== currentEventDate) {
      const daysDifference =
        (new Date(currentEventDate) - new Date(lastEventDate)) / (1000 * 60 * 60 * 24);
      if (daysDifference === 1) {
        data.streak.current = (data.streak.current || 0) + 1;
      } else {
        data.streak.current = 1;
      }
    } else {
      data.streak.current = 1;
    }
  }

  static async postEvent(type, name = '', action = '') {
    const eventLog = await getEvents();
    const statsData = JSON.parse(localStorage.getItem('statsData')) || {
      level: 1,
      totalXp: 0,
      currentLevelXp: 0,
      nextLevelXp: this.calculateNextLevelXp(1),
      streak: { current: 0 },
    };
    const timestamp = new Date().toISOString();

    console.log(`Event Type: ${type}`);
    console.log(`Event Name: ${name}`);
    console.log(`Event Action: ${action}`);

    const xpGained = this.calculateXpForEvent(type, statsData.streak.current);
    await this.addEvent({ type, name, action, timestamp, xpGained });
    this.updateStatsData(statsData, xpGained);
    this.calculateStreak(statsData, timestamp);

    console.log(`Updated Stats Data: ${JSON.stringify(statsData)}`);

    localStorage.setItem('statsData', JSON.stringify(statsData));
    await this.achievementTrigger(statsData);
  }

  static async getStats(type, name, action, startDate, endDate) {
    const eventLog = await getEvents();
    return eventLog.filter((event) => {
      const eventDate = new Date(event.timestamp);
      return (
        (!type || event.type === type) &&
        (!name || event.name === name) &&
        (!action || event.action === action) &&
        (!startDate || eventDate >= new Date(startDate)) &&
        (!endDate || eventDate <= new Date(endDate))
      );
    });
  }

  static async calculateXpBetweenDates(startDate, endDate) {
    const eventLog = await getEvents();
    return eventLog
      .filter((event) => {
        const eventDate = new Date(event.timestamp);
        return eventDate >= new Date(startDate) && eventDate <= new Date(endDate);
      })
      .reduce((totalXp, event) => totalXp + (event.xpGained || 0), 0);
  }
}
