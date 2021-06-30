export default class Stats {
    constructor(id) {
        this.id = id;
        this.domain = window.constants.UMAMI_DOMAIN;
    }

    async postEvent(type, name) {
        const value = name.toLowerCase().replaceAll(' ', '-');

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
                    event_value: value,
                    hostname: 'localhost',
                    language: localStorage.getItem('language').replace('_', '-'),
                    screen: `${window.screen.width}x${window.screen.height}`
                }
            })
        });

        let data = JSON.parse(localStorage.getItem('statsData'));
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

        let data = JSON.parse(localStorage.getItem('statsData'));
        data['tabs-opened'] = data['tabs-opened'] + 1 || 1;        
        localStorage.setItem('statsData', JSON.stringify(data));
    }
}