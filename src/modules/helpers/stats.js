export default class Stats {
  constructor(id) {
    this.id = id;
    this.url = window.constants.UMAMI_DOMAIN + '/api/collect';
    this.online = (localStorage.getItem('offlineMode') === 'false');
  }

  async postEvent(type, name) {
    const value = name.toLowerCase().replaceAll(' ', '-');

    if (this.online) {
      // umami
      await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'event',
          payload: {
            website: this.id,
            url: '/',
            event_type: type,
            event_value: value
          }
        })
      });
    }

    // local
    const data = JSON.parse(localStorage.getItem('statsData'));
    // tl;dr this creates the objects if they don't exist
    // this really needs a cleanup at some point
    if (!data[type] || !data[type][value]) {
      if (!data[type]) {
        data[type] = {};
      }

      if (!data[type][value]) {
        data[type][value] = 1;
      }
    } else {
      data[type][value] = data[type][value] + 1;
    }
    localStorage.setItem('statsData', JSON.stringify(data));
  }

  async tabLoad() {
    if (this.online) {
      // umami
      await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'pageview',
          payload: {
            website: this.id,
            url: '/',
            language: window.languagecode.replace('_', '-'),
            screen: `${window.screen.width}x${window.screen.height}`
          }
        })
      });
    }

    // local
    const data = JSON.parse(localStorage.getItem('statsData'));
    data['tabs-opened'] = data['tabs-opened'] + 1 || 1;        
    localStorage.setItem('statsData', JSON.stringify(data));
  }
}