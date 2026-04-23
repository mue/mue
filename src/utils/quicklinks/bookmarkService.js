/* global chrome */

import { readQuicklinks, writeQuicklinks } from './quicklinksUtils';
import { readConfig, writeConfig } from './configUtils';

export class BookmarkService {
  static async checkPermissions() {
    try {
      const hasPermission = await new Promise((resolve) => {
        if (typeof chrome !== 'undefined' && chrome.permissions) {
          chrome.permissions.contains({ permissions: ['bookmarks'] }, resolve);
        } else {
          resolve(false);
        }
      });

      return hasPermission;
    } catch (e) {
      console.error('Error checking bookmark permissions:', e);
      return false;
    }
  }

  static async requestPermissions() {
    try {
      if (typeof chrome !== 'undefined' && chrome.permissions) {
        return await chrome.permissions.request({ permissions: ['bookmarks'] });
      }
      return false;
    } catch (e) {
      console.error('Error requesting bookmark permissions:', e);
      return false;
    }
  }

  static async getBookmarks(folderId = null) {
    const hasPermission = await this.checkPermissions();
    if (!hasPermission) {
      throw new Error('Bookmark permission not granted');
    }

    try {
      const tree = await chrome.bookmarks.getTree();

      if (folderId) {
        return this.findFolder(tree[0], folderId);
      }

      return this.flattenBookmarks(tree[0].children[0]);
    } catch (e) {
      console.error('Error fetching bookmarks:', e);
      return [];
    }
  }

  static flattenBookmarks(node, results = []) {
    if (node.url) {
      results.push({
        id: node.id,
        title: node.title,
        url: node.url,
        dateAdded: node.dateAdded,
      });
    }

    if (node.children) {
      node.children.forEach((child) => this.flattenBookmarks(child, results));
    }

    return results;
  }

  static findFolder(node, folderId) {
    if (node.id === folderId) {
      return this.flattenBookmarks(node);
    }

    if (node.children) {
      for (const child of node.children) {
        const result = this.findFolder(child, folderId);
        if (result) return result;
      }
    }

    return null;
  }

  static async importBookmarks(selectedBookmarks = null) {
    const hasPermission = await this.checkPermissions();
    if (!hasPermission) {
      throw new Error('Bookmark permission not granted');
    }

    const bookmarks = selectedBookmarks || (await this.getBookmarks());
    const currentQuicklinks = readQuicklinks();
    const config = readConfig();

    const newLinks = bookmarks
      .filter((bm) => !currentQuicklinks.some((ql) => ql.bookmarkId === bm.id))
      .map((bm) => ({
        name: bm.title || bm.url,
        url: bm.url,
        icon: '',
        iconType: 'auto',
        iconData: null,
        iconFallbacks: [],
        groupId: null,
        order: currentQuicklinks.length,
        bookmarkId: bm.id,
        bookmarkSource: this.detectBrowser(),
        lastSynced: Date.now(),
        syncEnabled: true,
        customColor: null,
        hideLabel: false,
        key: `${Date.now()}_${Math.random().toString(36).substring(2)}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        accessCount: 0,
        lastAccessed: null,
      }));

    const updated = [...currentQuicklinks, ...newLinks];
    writeQuicklinks(updated);

    config.lastSyncTimestamp = Date.now();
    writeConfig(config);

    return newLinks.length;
  }

  static async syncBookmarks() {
    const config = readConfig();
    if (!config.bookmarkSyncEnabled) {
      return { imported: 0, updated: 0, removed: 0 };
    }

    const hasPermission = await this.checkPermissions();
    if (!hasPermission) {
      throw new Error('Bookmark permission not granted');
    }

    const bookmarks = await this.getBookmarks(config.bookmarkFolderId);
    const currentQuicklinks = readQuicklinks();

    let imported = 0;
    let updated = 0;
    let removed = 0;

    const bookmarkMap = new Map(bookmarks.map((bm) => [bm.id, bm]));
    const updatedLinks = currentQuicklinks
      .map((ql) => {
        if (ql.bookmarkId && ql.syncEnabled) {
          const bookmark = bookmarkMap.get(ql.bookmarkId);
          if (bookmark) {
            updated++;
            return {
              ...ql,
              name: bookmark.title || bookmark.url,
              url: bookmark.url,
              lastSynced: Date.now(),
              updatedAt: Date.now(),
            };
          } else if (config.syncDirection === 'two_way') {
            removed++;
            return null;
          }
        }
        return ql;
      })
      .filter(Boolean);

    const existingBookmarkIds = new Set(updatedLinks.map((ql) => ql.bookmarkId));
    const newLinks = bookmarks
      .filter((bm) => !existingBookmarkIds.has(bm.id))
      .map((bm) => {
        imported++;
        return {
          name: bm.title || bm.url,
          url: bm.url,
          icon: '',
          iconType: 'auto',
          iconData: null,
          iconFallbacks: [],
          groupId: null,
          order: updatedLinks.length + imported - 1,
          bookmarkId: bm.id,
          bookmarkSource: this.detectBrowser(),
          lastSynced: Date.now(),
          syncEnabled: true,
          customColor: null,
          hideLabel: false,
          key: `${Date.now()}_${Math.random().toString(36).substring(2)}_${imported}`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          accessCount: 0,
          lastAccessed: null,
        };
      });

    const final = [...updatedLinks, ...newLinks];
    writeQuicklinks(final);

    config.lastSyncTimestamp = Date.now();
    writeConfig(config);

    return { imported, updated, removed };
  }

  static detectBrowser() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('firefox')) return 'firefox';
    if (userAgent.includes('edg')) return 'edge';
    if (userAgent.includes('chrome')) return 'chrome';
    return 'unknown';
  }
}
