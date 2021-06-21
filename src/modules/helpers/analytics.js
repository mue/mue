export default class Analytics {
    constructor(id) {
        this.id = id;
        this.domain = window.constants.UMAMI_DOMAIN;
    }

    async postEvent(type, name) {
        await fetch(this.domain + '/api/collect', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'event',
                payload: {
                    website: this.id,
                    url: '/',
                    event_type: type,
                    event_value: name.toLowerCase().replaceAll(' ', '-'),
                    hostname: 'localhost',
                    language: localStorage.getItem('language').replace('_', '-'),
                    screen: `${window.screen.width}x${window.screen.height}`
                }
            })
        });
    }

    async tabLoad() {
        await fetch(this.domain + '/api/collect', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'pageview',
                payload: {
                    website: this.id,
                    url: '/',
                    referrer: '',
                    hostname: 'localhost',
                    language: localStorage.getItem('language').replace('_', '-'),
                    screen: `${window.screen.width}x${window.screen.height}`
                }
            })
        });
    }
}