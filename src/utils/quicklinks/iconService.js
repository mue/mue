const ICON_PROVIDERS = {
  'icon.horse': (domain) => `https://icon.horse/icon/${domain}`,
  google: (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
  duckduckgo: (domain) => `https://icons.duckduckgo.com/ip3/${domain}.ico`,
  placeholder: () => null,
};

export class IconService {
  static getIconUrl(item, fallbackChain = ['icon.horse', 'google', 'duckduckgo', 'placeholder']) {
    if (item.iconType === 'custom_upload' && item.iconData) {
      return item.iconData;
    }

    if (item.iconType === 'custom_url' && item.icon) {
      return item.icon.trim();
    }

    if (item.iconType === 'emoji' && item.icon) {
      return null;
    }

    if (item.iconType === 'letter') {
      return null;
    }

    const domain = this.extractDomain(item.url);
    return fallbackChain.map((provider) => ICON_PROVIDERS[provider]?.(domain)).filter(Boolean);
  }

  static extractDomain(url) {
    try {
      return url
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .split('/')[0]
        .trim();
    } catch {
      return url.trim();
    }
  }

  static async uploadCustomIcon(file) {
    return new Promise((resolve, reject) => {
      if (file.size > 2 * 1024 * 1024) {
        reject(new Error('File must be under 2MB'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  static generateLetterAvatar(name) {
    const letter = name.charAt(0).toUpperCase();
    const colors = [
      '#3498db',
      '#e74c3c',
      '#2ecc71',
      '#f39c12',
      '#9b59b6',
      '#1abc9c',
      '#e67e22',
      '#34495e',
    ];
    const colorIndex = letter.charCodeAt(0) % colors.length;

    return {
      letter,
      backgroundColor: colors[colorIndex],
    };
  }
}
