import {
  addEvent,
  getEvents,
  updateSessionStats,
  getAllSessionStats,
  clearSessionStats,
} from 'utils/indexedDB';
import { newAchievements, getLocalisedAchievementData } from './achievements';
import { toast } from 'react-toastify';
import variables from 'config/variables';

export default class Stats {
  static #currentTabId = null;

  static generateTabId() {
    return `tab_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }

  static getCurrentTabId() {
    if (!this.#currentTabId) {
      this.#currentTabId = this.generateTabId();
    }
    return this.#currentTabId;
  }

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

  static async calculateStreak(data) {
    const events = await getEvents();
    if (!events || events.length < 2) {
      data.streak.current = 1;
      data.streak.highest = 1;
      return;
    }

    let currentStreak = 1;
    let highestStreak = data.streak.highest || 1;

    for (let i = events.length - 2; i >= 0; i--) {
      const currentEventDate = new Date(events[i].timestamp).toDateString();
      const nextEventDate = new Date(events[i + 1].timestamp).toDateString();

      const daysDifference =
        (new Date(nextEventDate) - new Date(currentEventDate)) / (1000 * 60 * 60 * 24);

      if (daysDifference === 1) {
        currentStreak += 1;
      } else {
        if (currentStreak > highestStreak) {
          highestStreak = currentStreak;
        }
        currentStreak = 1;
      }
    }

    if (currentStreak > highestStreak) {
      highestStreak = currentStreak;
    }

    data.streak.current = currentStreak;
    data.streak.highest = highestStreak;
  }

  static async updateSessionStats(event) {
    const { tabId, timestamp, xpGained } = event;
    let session = await this.getSessionStats(tabId);

    if (!session) {
      session = {
        tabId,
        startTime: timestamp,
        endTime: timestamp,
        duration: 0,
        eventCount: 0,
        totalXp: 0,
        averageXpPerEvent: 0,
      };
    }

    session.endTime = timestamp;
    session.duration = new Date(session.endTime) - new Date(session.startTime);
    session.eventCount += 1;
    session.totalXp += xpGained;
    session.averageXpPerEvent = session.totalXp / session.eventCount;

    await updateSessionStats(session);
    return session;
  }

  static async getSessionStats(tabId) {
    const sessions = await getAllSessionStats();
    return sessions.find((session) => session.tabId === tabId);
  }

  static getAllSessionStats() {
    return getAllSessionStats();
  }

  static clearSessionStats() {
    return clearSessionStats();
  }

  static async postEvent(type, name = '', action = '') {
    const eventLog = await getEvents();
    const statsData = JSON.parse(localStorage.getItem('statsData')) || {
      level: 1,
      totalXp: 0,
      currentLevelXp: 0,
      nextLevelXp: this.calculateNextLevelXp(1),
      streak: { current: 0, highest: 0 },
    };
    const timestamp = new Date().toISOString();
    const tabId = this.getCurrentTabId();

    console.log(`Event Type: ${type}`);
    console.log(`Event Name: ${name}`);
    console.log(`Event Action: ${action}`);
    console.log(`Tab ID: ${tabId}`);

    const xpGained = this.calculateXpForEvent(type, statsData.streak.current);
    const event = { type, name, action, timestamp, xpGained, tabId };
    await this.addEvent(event);
    await this.updateSessionStats(event); // Now awaits the IndexedDB operation
    this.updateStatsData(statsData, xpGained);
    await this.calculateStreak(statsData);

    console.log(`Updated Stats Data: ${JSON.stringify(statsData)}`);

    localStorage.setItem('statsData', JSON.stringify(statsData));
    await this.achievementTrigger(statsData);
  }

  static async getStats(type, name, action, startDate, endDate, tabId) {
    const eventLog = await getEvents();
    return eventLog.filter((event) => {
      const eventDate = new Date(event.timestamp);
      return (
        (!type || event.type === type) &&
        (!name || event.name === name) &&
        (!action || event.action === action) &&
        (!startDate || eventDate >= new Date(startDate)) &&
        (!endDate || eventDate <= new Date(endDate)) &&
        (!tabId || event.tabId === tabId)
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
