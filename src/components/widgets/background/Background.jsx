import React from 'react';

import PhotoInformation from './PhotoInformation';

import './scss/index.scss';

export default class Background extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      style: '',
      url: '',
      video: false,
      photoInfo: {
        hidden: false,
        credit: '',
        url: ''
      }
    };
    this.language = window.language.widgets.background;
    this.ddgproxy = (localStorage.getItem('ddgProxy') === 'true');
  }

  gradientStyleBuilder(gradientSettings) {
    const { type, angle, gradient } = gradientSettings;
    let style = `background: ${gradient[0].colour};`;
    if (gradient.length > 1) {
      // Note: Append the gradient for additional browser support.
      const stepStyles = gradient.map(g => ` ${g.colour} ${g.stop}%`).join();
      style += ` background: ${type}-gradient(${(type === 'linear' ? (`${angle}deg,`) : '')}${stepStyles})`;
    }
    this.setState({
      style: style
    });
  }

  offlineBackground() {
    const offlineImages = require('./offline_images.json');

    // Get all photographers from the keys in offlineImages.json
    const photographers = Object.keys(offlineImages);
    // Select a random photographer from the keys
    const photographer = photographers[Math.floor(Math.random() * photographers.length)];

    // Select a random image
    const randomImage = offlineImages[photographer].photo[
      Math.floor(Math.random() * offlineImages[photographer].photo.length)
    ];

    this.setState({
      url: `./offline-images/${randomImage}.jpg`,
      photoInfo: {
        hidden: true,
        credit: photographer
      }
    });
  }

  setBackground() {
    // Brightness
    let brightness = localStorage.getItem('brightness');
    if (localStorage.getItem('brightnessTime') && new Date().getHours() > 18) {
      brightness = 75;
    }

    if (this.state.url !== '') {
      const url = this.ddgproxy ? window.constants.DDG_PROXY + this.state.url : this.state.url;

      document.querySelector('#backgroundImage').setAttribute(
        'style',
        `background-image: url(${url}); -webkit-filter: blur(${localStorage.getItem('blur')}px) brightness(${brightness}%);`
      );
    } else {
      document.querySelector('#backgroundImage').setAttribute(
        'style',
        `${this.state.style}; -webkit-filter: blur(${localStorage.getItem('blur')}px) brightness(${brightness}%);`
      );
    }
  }

  // Main background getting function
  async getBackground() {
    if (localStorage.getItem('offlineMode') === 'true') {
      return this.offlineBackground();
    }

    switch (localStorage.getItem('backgroundType')) {
      case 'api':
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

        let requestURL, data;
        switch (backgroundAPI) {
          case 'unsplash':
            requestURL = `${window.constants.UNSPLASH_URL}/getImage`;
            break;
          // Defaults to Mue
          default:
            requestURL = `${window.constants.API_URL}/getImage?category=Outdoors`;
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
          photoInfo: {
            credit: (backgroundAPI !== 'unsplash') ? data.photographer : data.photographer + ` ${this.language.unsplash}`,
            location: (data.location.replace(/[null]+/g, '') !== ' ') ? data.location : 'N/A',
            camera: data.camera || 'N/A',
            resolution: data.resolution || 'N/A',
            url: data.file
          }
        });
      break;

      case 'colour':
        // background colour
        const customBackgroundColour = localStorage.getItem('customBackgroundColour');
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
        // custom user background
        const customBackground = localStorage.getItem('customBackground');
        if (customBackground !== '') {
          // video background
          if (customBackground.endsWith('.mp4') || customBackground.endsWith('.webm') || customBackground.endsWith('.ogg')) { 
            return this.setState({
              url: customBackground,
              video: true,
              photoInfo: {
                hidden: true
              }
          });
        // normal background
        } else {
          return this.setState({
            url: customBackground,
            photoInfo: {
              hidden: true
            }
          });
        }
      }
      break;

      case 'photo_pack':
        // photo pack
        const photoPack = JSON.parse(localStorage.getItem('photo_packs'));
        if (photoPack) {
          const randomPhoto = photoPack[Math.floor(Math.random() * photoPack.length)];
          return this.setState({
            url: randomPhoto.url.default,
            photoInfo: {
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
    if (localStorage.getItem('background') === 'false') {
      return;
    }

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
      const checkValue = (setting) => {
        return (localStorage.getItem(setting) === 'true');
      };

      return (
        <video autoPlay muted={checkValue('backgroundVideoMute')} loop={checkValue('backgroundVideoLoop')} id='backgroundVideo'>
          <source src={this.state.url}/>
        </video>
      );
    }

    return (
      <>
        <div id='backgroundImage'/>
        {(this.state.photoInfo.credit !== '') ? <PhotoInformation className={this.props.photoInformationClass} info={this.state.photoInfo}/>
        : null}
      </>
    );
  }
}
