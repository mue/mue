import React from 'react';

import PhotoInformation from './PhotoInformation';

import * as Constants from '../../../modules/constants';

import './scss/index.scss';

export default class Background extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      style: '',
      url: '',
      video: false,
      photoInfo: {
        hidden: false,
        credit: '',
        location: 'N/A',
        camera: 'N/A',
        resolution: 'N/A'
      }
    };
    this.language = window.language.widgets.background;
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

  setBackground() {
    // Brightness
    let brightness = localStorage.getItem('brightness');
    if (localStorage.getItem('brightnessTime') && new Date().getHours() > 18) {
      brightness = 75;
    }

    if (this.state.url !== '') {
      document.querySelector('#backgroundImage').setAttribute(
        'style',
        `background-image: url(${this.state.url}); -webkit-filter: blur(${localStorage.getItem('blur')}px) brightness(${brightness}%);`
      );
    } else {
      document.querySelector('#backgroundImage').setAttribute(
        'style',
        `${this.state.style}; -webkit-filter: blur(${localStorage.getItem('blur')}px) brightness(${brightness}%);`
      );
    }
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

  // Main background getting function
  async getBackground() {
    if (localStorage.getItem('offlineMode') === 'true') {
       return this.offlineBackground();
    }

    // favourite button
    const favourited = JSON.parse(localStorage.getItem('favourite'));
    if (favourited) {
      return this.setState({
        url: favourited.url,
        photoInfo: {
          credit: favourited.credit,
          location: favourited.location
        }
      });
    }

    // background colour
    const customBackgroundColour = localStorage.getItem('customBackgroundColour');
    if (customBackgroundColour !== 'Disabled' && customBackgroundColour !== '') {
      let gradientSettings = '';
      try {
        gradientSettings = JSON.parse(colour);
      } catch (e) {
        const hexColorRegex = /#[0-9a-fA-F]{6}/s;
        if (hexColorRegex.exec(colour)) {
          // Colour use to be simply a hex colour or a NULL value before it was a JSON object. This automatically upgrades the hex colour value to the new standard. (NULL would not trigger an exception)
          gradientSettings = { "type": "linear", "angle": "180", "gradient": [{ "colour": colour, "stop": 0 }] };
          localStorage.setItem('customBackgroundColour', JSON.stringify(gradientSettings));
        }
      }

      if (typeof gradientSettings === 'object' && gradientSettings !== null) {
        return this.gradientStyleBuilder(gradientSettings);
      }
    }

    // custom user background
    const customBackground = localStorage.getItem('customBackground');
    if (customBackground !== '') {
      // video background
      if (customBackground.includes('.mp4') || customBackground.includes('.webm') || customBackground.includes('.ogg')) { 
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

    // API background
    const backgroundAPI = localStorage.getItem('backgroundAPI');

    let requestURL, data;
    switch (backgroundAPI) {
      case 'unsplash':
        requestURL = `${Constants.UNSPLASH_URL}/getImage`;
        break;
      // Defaults to Mue
      default:
        requestURL = `${Constants.API_URL}/getImage?category=Outdoors`;
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
        credit: (backgroundAPI !== 'unsplash') ? data.photographer : data.photographer + ' on Unsplash',
        location: (data.location.replace(/[null]+/g, '') !== ' ') ? data.location : 'N/A',
        camera: data.camera || 'N/A',
        resolution: data.resolution || 'N/A'
      }
    });
  }

  componentDidMount() {
    if (localStorage.getItem('background') === 'false') {
      return;
    }

    this.getBackground();
  }

  // only set once we've got the info
  componentDidUpdate() {
    this.setBackground();
  }

  render() {
    return (
      <React.Fragment>
        <div id='backgroundImage'/>
        <PhotoInformation className={this.props.photoInformationClass} info={this.state.photoInfo}/>
      </React.Fragment>
    );
  }
}
