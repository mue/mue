// warning: the code here is fairly messy and probably needs a rewrite
import React from 'react';

import EventBus from '../../../modules/helpers/eventbus';

import PhotoInformation from './PhotoInformation';

import './scss/index.scss';

export default class Background extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      style: '',
      url: '',
      currentAPI: '',
      photoInfo: {
        hidden: false
      }
    };
    this.language = window.language.widgets.background;
  }

  gradientStyleBuilder(gradientSettings) {
    const { type, angle, gradient } = gradientSettings;
    let style = `background: ${gradient[0].colour};`;

    if (gradient.length > 1) {
      // Note: Append the gradient for additional browser support.
      const stepStyles = gradient.map((g) => ` ${g.colour} ${g.stop}%`).join();
      style += ` background: ${type}-gradient(${(type === 'linear' ? (`${angle}deg,`) : '')}${stepStyles})`;
    }

    this.setState({
      type: 'colour',
      style: style
    });
  }

  videoCheck(url) {
    return url.startsWith('data:video/') || url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg');
  }

  offlineBackground() {
    const offlineImages = require('./offline_images.json');

    // Get all photographers from the keys in offlineImages.json
    const photographers = Object.keys(offlineImages);
    const photographer = photographers[Math.floor(Math.random() * photographers.length)];

    const randomImage = offlineImages[photographer].photo[
      Math.floor(Math.random() * offlineImages[photographer].photo.length)
    ];

    this.setState({
      url: `./offline-images/${randomImage}.webp`,
      photoInfo: {
        credit: photographer
      }
    });
  }

  setBackground() {
    const backgroundImage = document.getElementById('backgroundImage');

    if (this.state.url !== '') {
      const url = (localStorage.getItem('ddgProxy') === 'true') ? window.constants.DDG_PROXY + this.state.url : this.state.url;
      const photoInformation = document.querySelector('.photoInformation');

      if (localStorage.getItem('bgtransition') === 'false') {
        if (photoInformation) {
          photoInformation.style.display = 'block';
        }
        backgroundImage.style.backgroundImage = null;
        return backgroundImage.style.backgroundImage = `url(${url})`; 
      }

      backgroundImage.classList.add('backgroundPreload');
      backgroundImage.style.backgroundImage = null;

      if (photoInformation) {
        photoInformation.classList.add('backgroundPreload');
      }

      // preloader for background transition
      let preloader = document.createElement('img');
      preloader.src = url;

      // once image has loaded, add the fade-in transition
      preloader.addEventListener('load', () => {
        backgroundImage.classList.remove('backgroundPreload');
        backgroundImage.classList.add('fade-in');

        backgroundImage.style.backgroundImage = `url(${url})`;        
        preloader.remove();

        if (photoInformation) {
          photoInformation.classList.remove('backgroundPreload');
          photoInformation.classList.add('fade-in');
        }
      });
    } else {
      backgroundImage.setAttribute('style', `${this.state.style};`);
    }
  }

  // Main background getting function
  async getBackground() {
    const offline = (localStorage.getItem('offlineMode') === 'true');

    switch (localStorage.getItem('backgroundType')) {
      case 'api':
        if (offline) {
          return this.offlineBackground();
        }

        // favourite button
        const favourited = JSON.parse(localStorage.getItem('favourite'));
        if (favourited) {
          return this.setState({
             url: favourited.url,
             photoInfo: {
              credit: favourited.credit
            }
          });
        }

        // API background
        const backgroundAPI = localStorage.getItem('backgroundAPI');
        const apiCategory = localStorage.getItem('apiCategory');

        let requestURL, data;
        switch (backgroundAPI) {
          case 'unsplash':
            //requestURL = `${window.constants.UNSPLASH_URL}/getImage?category=${apiCategory}`;
            requestURL = `${window.constants.UNSPLASH_URL}/getImage`;
            break;
          // Defaults to Mue
          default:
            requestURL = `${window.constants.API_URL}/images/random?category=${apiCategory}`;
            break;
        }

        try {
          data = await (await fetch(requestURL)).json();
        } catch (e) {
          // if requesting to the API fails, we get an offline image
          return this.offlineBackground();
        } 

        this.setState({
          url: data.file,
          type: 'api',
          currentAPI: backgroundAPI,
          photoInfo: {
            hidden: false,
            credit: (backgroundAPI !== 'unsplash') ? data.photographer : data.photographer + ` ${this.language.unsplash}`,
            location: (data.location.replace(/[null]+/g, '') !== ' ') ? data.location : 'N/A',
            camera: data.camera,
            resolution: data.resolution,
            url: data.file
          }
        });
      break;

      case 'colour':
        const customBackgroundColour = localStorage.getItem('customBackgroundColour') || {'angle':'180','gradient':[{'colour':'#ffb032','stop':0}],'type':'linear'};

        let gradientSettings = '';
        try {
          gradientSettings = JSON.parse(customBackgroundColour);
        } catch (e) {
          const hexColorRegex = /#[0-9a-fA-F]{6}/s;
          if (hexColorRegex.exec(customBackgroundColour)) {
            // Colour use to be simply a hex colour or a NULL value before it was a JSON object. This automatically upgrades the hex colour value to the new standard. (NULL would not trigger an exception)
            gradientSettings = { 'type': 'linear', 'angle': '180', 'gradient': [{ 'colour': customBackgroundColour, 'stop': 0 }] };
            localStorage.setItem('customBackgroundColour', JSON.stringify(gradientSettings));
          }
        }

        if (typeof gradientSettings === 'object' && gradientSettings !== null) {
          return this.gradientStyleBuilder(gradientSettings);
        }
      break;

      case 'custom':
        const customBackground = localStorage.getItem('customBackground');

        // allow users to use offline images
        if (offline && !customBackground.startsWith('data:')) {
          return this.offlineBackground();
        }

        if (customBackground !== '' && customBackground !== 'undefined') {
          this.setState({
            url: customBackground,
            type: 'custom',
            video: this.videoCheck(customBackground),
            photoInfo: {
              hidden: true
            }
          });
        }
      break;

      case 'photo_pack':
        if (offline) {
          return this.offlineBackground();
        }

        const photoPack = JSON.parse(localStorage.getItem('photo_packs'));
        if (photoPack) {
          const randomPhoto = photoPack[Math.floor(Math.random() * photoPack.length)];
          return this.setState({
            url: randomPhoto.url.default,
            photoInfo: {
              hidden: false,
              credit: randomPhoto.photographer
            }
          });
        }
      break;
      default: 
        break;
    }
  }

  componentDidMount() {
    const element = document.getElementById('backgroundImage');

    const refresh = () => {
      element.classList.remove('fade-in');
      this.setState({
        url: '',
        video: false,
        photoInfo: {
          hidden: true
        }
      });
      this.getBackground();
    };

    EventBus.on('refresh', (data) => {
      if (data === 'background') {
        if (localStorage.getItem('background') === 'false') {
          if (this.state.photoInfo.hidden === false) {
            document.querySelector('.photoInformation').style.display = 'none';
          }

          if (this.state.video === true) {
            return document.getElementById('backgroundVideo').style.display = 'none';
          } else {
            return element.style.display = 'none';
          }
        }

        if (this.state.video === true) {
          document.getElementById('backgroundVideo').style.display = 'block';
        } else {
          element.style.display = 'block';
        }

        if (this.state.photoInfo.hidden === false) {
          document.querySelector('.photoInformation').style.display = 'block';
        }

        const backgroundType = localStorage.getItem('backgroundType');

        // todo: make this good
        if (backgroundType !== this.state.type 
          || (localStorage.getItem('backgroundAPI') !== this.state.currentAPI && backgroundType === 'api') 
          || (backgroundType === 'custom' && localStorage.getItem('customBackground') !== this.state.url)
        ) {
          return refresh();
        }

        if (this.state.video === true) {
          document.getElementById('backgroundVideo').style.webkitFilter = `blur(${localStorage.getItem('blur')}px) brightness(${localStorage.getItem('brightness')}%)`;
        } else {
          element.style.webkitFilter = `blur(${localStorage.getItem('blur')}px) brightness(${localStorage.getItem('brightness')}%)`;
        }
      }

      if (data === 'marketplacebackgrounduninstall') {
        refresh();
      }
    });

    this.getBackground();
  }

  // only set once we've got the info
  componentDidUpdate() {
    if (this.state.video === true) {
      return;
    }

    this.setBackground();
  }

  render() {
    if (this.state.video === true) {
      const enabled = (setting) => {
        return (localStorage.getItem(setting) === 'true');
      };

      return (
        <video autoPlay muted={enabled('backgroundVideoMute')} loop={enabled('backgroundVideoLoop')} style={{ 'WebkitFilter': `blur(${localStorage.getItem('blur')}px) brightness(${localStorage.getItem('brightness')}%)` }} id='backgroundVideo'>
          <source src={this.state.url}/>
        </video>
      );
    }

    return (
      <>
        <div style={{ 'WebkitFilter': `blur(${localStorage.getItem('blur')}px) brightness(${localStorage.getItem('brightness')}%)` }} id='backgroundImage'/>
        {(this.state.photoInfo.credit !== '') ? 
          <PhotoInformation className={this.props.photoInformationClass} info={this.state.photoInfo}/>
        : null}
      </>
    );
  }
}
