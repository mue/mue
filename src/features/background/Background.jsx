import React, { PureComponent } from 'react';
import variables from 'config/variables';
import PhotoInformation from './components/PhotoInformation';
import EventBus from 'utils/eventbus';
import { getOfflineImage } from './api/getOfflineImage';
import { supportsAVIF } from './api/avif';
import videoCheck from './api/videoCheck';
import { randomColourStyleBuilder } from './api/randomColour';
import { decodeBlurHash } from 'fast-blurhash';
import defaults from './options/default';
import Stats from 'features/stats/api/stats';
import BackgroundImage from './components/BackgroundImage';
import BackgroundVideo from './components/BackgroundVideo';
import './scss/index.scss';

export default class Background extends PureComponent {
  constructor() {
    super();
    this.state = {
      blob: null,
      style: '',
      url: '',
      currentAPI: '',
      firstTime: false,
      photoInfo: {
        hidden: false,
        offline: false,
        photographerURL: '',
        photoURL: '',
      },
    };
  }

  async componentDidMount() {
    const element = document.getElementById('backgroundImage');
    EventBus.on('refresh', (data) => this.handleRefreshEvent(data));
    EventBus.on('backgroundeffect', () => this.handleBackgroundEffectEvent());
    if (localStorage.getItem('welcomeTab')) {
      this.setState(JSON.parse(localStorage.getItem('welcomeImage')));
      return;
    }
    this.getBackground();
  }

  componentDidUpdate() {
    if (this.state.video !== true) {
      this.setBackground();
    }
  }

  componentWillUnmount() {
    EventBus.off('refresh');
    EventBus.off('backgroundeffect');
  }

  async setBackground() {
    if (this.blob) {
      URL.revokeObjectURL(this.blob);
    }
    const backgroundImage = document.getElementById('backgroundImage');
    if (this.state.url !== '') {
      let url = this.state.url;
      const photoInformation = document.querySelector('.photoInformation');
      if (localStorage.getItem('bgtransition') === 'false') {
        if (photoInformation) {
          photoInformation.style.display = 'flex';
        }
        backgroundImage.style.background = `url(${url})`;
        return;
      }
      backgroundImage.style.background = null;
      if (this.state.photoInfo.blur_hash) {
        backgroundImage.style.backgroundColor = this.state.photoInfo.colour;
        backgroundImage.classList.add('fade-in');
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(32, 32);
        imageData.data.set(decodeBlurHash(this.state.photoInfo.blur_hash, 32, 32));
        ctx.putImageData(imageData, 0, 0);
        backgroundImage.style.backgroundImage = `url(${canvas.toDataURL()})`;
      }
      this.blob = URL.createObjectURL(await (await fetch(url)).blob());
      backgroundImage.classList.add('backgroundTransform');
      backgroundImage.style.backgroundImage = `url(${this.blob})`;
      Stats.postEvent('feature', 'background-image', 'shown');
    } else {
      backgroundImage.setAttribute('style', this.state.style);
      Stats.postEvent('background', 'colour', 'set');
    }
  }

  async getAPIImageData(currentPun) {
    let apiCategories;
    try {
      apiCategories = JSON.parse(localStorage.getItem('apiCategories'));
    } catch (error) {
      apiCategories = localStorage.getItem('apiCategories');
    }
    const backgroundAPI = localStorage.getItem('backgroundAPI') || defaults.backgroundAPI;
    const apiQuality = localStorage.getItem('apiQuality') || defaults.apiQuality;
    let backgroundExclude = JSON.parse(localStorage.getItem('backgroundExclude'));
    if (!Array.isArray(backgroundExclude)) {
      backgroundExclude = [];
    }
    if (currentPun) {
      backgroundExclude.push(currentPun);
    }
    let requestURL, data;
    switch (backgroundAPI) {
      case 'unsplash':
      case 'pexels':
        const collection =
          localStorage.getItem('unsplashCollections') || defaults.unsplashCollections;
        requestURL = collection
          ? `${variables.constants.API_URL}/images/unsplash?collections=${collection}&quality=${apiQuality}`
          : `${variables.constants.API_URL}/images/unsplash?categories=${apiCategories || ''}&quality=${apiQuality}`;
        break;
      default:
        requestURL = `${variables.constants.API_URL}/images/random?categories=${apiCategories || ''}&quality=${apiQuality}&excludes=${backgroundExclude}`;
        break;
    }
    const accept = `application/json, ${supportsAVIF() ? 'image/avif' : 'image/webp'}`;
    try {
      data = await (await fetch(requestURL, { headers: { accept } })).json();
    } catch (e) {
      this.setState(getOfflineImage('api'));
      Stats.postEvent('background', 'image', 'offline');
      return null;
    }
    let photoURL, photographerURL;
    if (backgroundAPI === 'unsplash') {
      photoURL = data.photo_page;
      photographerURL = data.photographer_page;
    }
    return {
      url: data.file,
      type: 'api',
      currentAPI: backgroundAPI,
      photoInfo: {
        hidden: false,
        category: data.category,
        credit: data.photographer,
        location: data.location.name,
        camera: data.camera,
        url: data.file,
        photographerURL,
        photoURL,
        latitude: data.location.latitude || null,
        longitude: data.location.longitude || null,
        views: data.views || null,
        downloads: data.downloads || null,
        likes: data.likes || null,
        description: data.description || null,
        colour: data.colour,
        blur_hash: data.blur_hash,
        pun: data.pun || null,
      },
    };
  }

  async getBackground() {
    let offline = localStorage.getItem('offlineMode') === 'true';
    if (localStorage.getItem('showWelcome') !== 'false') {
      offline = true;
    }
    const setFavourited = ({ type, url, credit, location, camera, pun, offline }) => {
      if (type === 'random_colour' || type === 'random_gradient') {
        this.setState({
          type: 'colour',
          style: `background:${url}`,
        });
      } else {
        this.setState({
          url,
          photoInfo: {
            credit,
            location,
            camera,
            pun,
            offline,
            url,
          },
        });
      }
      Stats.postEvent('background', 'favourite', 'set');
    };
    const favourited = JSON.parse(localStorage.getItem('favourite'));
    if (favourited) {
      setFavourited(favourited);
      return;
    }
    const type = localStorage.getItem('backgroundType') || defaults.backgroundType;
    switch (type) {
      case 'api':
        if (offline) {
          this.setState(getOfflineImage('api'));
          Stats.postEvent('background', 'image', 'offline');
          return;
        }
        let data = JSON.parse(localStorage.getItem('nextImage')) || (await this.getAPIImageData());
        localStorage.setItem('nextImage', null);
        if (data) {
          this.setState(data);
          localStorage.setItem('currentBackground', JSON.stringify(data));
          localStorage.setItem(
            'nextImage',
            JSON.stringify(await this.getAPIImageData(data.photoInfo.pun)),
          );
          Stats.postEvent('background', 'image', 'api');
        }
        break;
      case 'colour':
        let customBackgroundColour = localStorage.getItem('customBackgroundColour');
        if (customBackgroundColour && customBackgroundColour.startsWith('{')) {
          const customBackground = JSON.parse(customBackgroundColour);
          try {
            localStorage.setItem('customBackgroundColour', customBackground.gradient[0].colour);
            customBackgroundColour = customBackground.gradient.colour;
          } catch (e) {
            customBackgroundColour = 'rgb(0,0,0)';
          }
        }
        this.setState({
          type: 'colour',
          style: `background: ${customBackgroundColour || 'rgb(0,0,0)'}`,
        });
        Stats.postEvent('background', 'colour', 'custom');
        break;
      case 'random_colour':
      case 'random_gradient':
        this.setState(randomColourStyleBuilder(type));
        Stats.postEvent('background', 'colour', 'random');
        break;
      case 'custom':
        let customBackground = [];
        const customSaved = localStorage.getItem('customBackground') || defaults.customBackground;
        try {
          customBackground = JSON.parse(customSaved);
        } catch (e) {
          if (customSaved !== '') {
            customBackground = [customSaved];
          }
          localStorage.setItem('customBackground', JSON.stringify(customBackground));
        }
        customBackground = customBackground[Math.floor(Math.random() * customBackground.length)];
        if (offline && !customBackground.startsWith('data:')) {
          this.setState(getOfflineImage('custom'));
          Stats.postEvent('background', 'image', 'offline');
          return;
        }
        if (
          customBackground !== '' &&
          customBackground !== 'undefined' &&
          customBackground !== undefined
        ) {
          const object = {
            url: customBackground,
            type: 'custom',
            video: videoCheck(customBackground),
            photoInfo: {
              hidden: true,
            },
          };
          this.setState(object);
          localStorage.setItem('currentBackground', JSON.stringify(object));
          Stats.postEvent('background', 'image', 'custom');
        }
        break;
      case 'photo_pack':
        if (offline) {
          this.setState(getOfflineImage('photo'));
          Stats.postEvent('background', 'image', 'offline');
          return;
        }
        const photoPack = [];
        const installed = JSON.parse(localStorage.getItem('installed'));
        installed.forEach((item) => {
          if (item.type === 'photos') {
            const photos = item.photos.map((photo) => photo);
            photoPack.push(...photos);
          }
        });
        if (photoPack.length === 0) {
          this.setState(getOfflineImage('photo'));
          Stats.postEvent('background', 'image', 'offline');
          return;
        }
        const photo = photoPack[Math.floor(Math.random() * photoPack.length)];
        this.setState({
          url: photo.url.default,
          type: 'photo_pack',
          video: videoCheck(photo.url.default),
          photoInfo: {
            photographer: photo.photographer,
          },
        });
        Stats.postEvent('background', 'image', 'photo_pack');
        break;
      default:
        break;
    }
  }

  handleRefreshEvent(data) {
    const element = document.getElementById('backgroundImage');
    const refresh = () => {
      element.classList.remove('fade-in');
      this.setState({
        url: '',
        style: '',
        type: '',
        video: false,
        photoInfo: {
          hidden: true,
        },
      });
      this.getBackground();
    };
    if (data === 'welcomeLanguage') {
      localStorage.setItem('welcomeImage', JSON.stringify(this.state));
    }
    if (data === 'background') {
      if (localStorage.getItem('background') === 'false') {
        if (this.state.photoInfo.hidden === false) {
          document.querySelector('.photoInformation').style.display = 'none';
        }
        if (this.state.video === true) {
          document.getElementById('backgroundVideo').style.display = 'none';
        } else {
          element.style.display = 'none';
        }
        return;
      }
      if (this.state.video === true) {
        document.getElementById('backgroundVideo').style.display = 'block';
      } else {
        if (this.state.photoInfo.hidden === false) {
          try {
            document.querySelector('.photoInformation').style.display = 'flex';
          } catch (e) {
            // Disregard exception
          }
        }
        element.style.display = 'block';
      }
      const backgroundType = localStorage.getItem('backgroundType') || defaults.backgroundType;
      if (this.state.photoInfo.offline !== true) {
        if (
          backgroundType !== this.state.type ||
          (this.state.type === 'api' &&
            localStorage.getItem('backgroundAPI') !== this.state.currentAPI) ||
          (this.state.type === 'custom' &&
            localStorage.getItem('customBackground') !== this.state.url) ||
          JSON.parse(localStorage.getItem('backgroundExclude')).includes(this.state.photoInfo.pun)
        ) {
          refresh();
          return;
        }
      } else if (backgroundType !== this.state.type) {
        refresh();
        return;
      }
    }
    if (
      data === 'marketplacebackgrounduninstall' ||
      data === 'backgroundwelcome' ||
      data === 'backgroundrefresh'
    ) {
      refresh();
    }
  }

  handleBackgroundEffectEvent() {
    const element = document.getElementById('backgroundImage');
    const backgroundFilterSetting =
      localStorage.getItem('backgroundFilter') || defaults.backgroundFilter;
    const backgroundFilter = backgroundFilterSetting && backgroundFilterSetting !== 'none';
    const filterValue = `blur(${localStorage.getItem('blur')}px) brightness(${localStorage.getItem(
      'brightness',
    )}%) ${
      backgroundFilter
        ? backgroundFilterSetting + '(' + localStorage.getItem('backgroundFilterAmount') + '%)'
        : ''
    }`;
    if (this.state.video === true) {
      document.getElementById('backgroundVideo').style.filter = filterValue;
    } else {
      element.style.filter = filterValue;
    }
  }

  render() {
    if (this.state.video === true) {
      return <BackgroundVideo url={this.state.url} />;
    }
    return (
      <>
        <BackgroundImage />
        {this.state.photoInfo.credit !== '' && (
          <PhotoInformation
            info={this.state.photoInfo}
            api={this.state.currentAPI}
            url={this.state.url}
          />
        )}
      </>
    );
  }
}
