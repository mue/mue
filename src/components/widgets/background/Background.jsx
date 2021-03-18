import React from 'react';

import * as Constants from '../../../modules/constants';

import './scss/index.scss';

export default class Background extends React.PureComponent {
  gradientStyleBuilder(gradientSettings) {
    const { type, angle, gradient } = gradientSettings;
    let style = `background: ${gradient[0].colour};`;
    if (gradient.length > 1) {
      // Note: Append the gradient for additional browser support.
      const stepStyles = gradient.map(g => ` ${g.colour} ${g.stop}%`).join();
      style += ` background: ${type}-gradient(${(type === 'linear' ? (`${angle}deg,`) : '')}${stepStyles})`;
    }
    return style;
  }

  // Sets the attributes of the background image
  setBackground(url, colour, credit) {
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

    const background = typeof gradientSettings === 'object' && gradientSettings !== null ? this.gradientStyleBuilder(gradientSettings) : `background-image: url(${url})`;

    // Brightness
    let brightness = localStorage.getItem('brightness');
    if (localStorage.getItem('brightnessTime') && new Date().getHours() > 18) {
      brightness = 75;
    }

    document.querySelector('#backgroundImage').setAttribute(
      'style',
      `${background}; -webkit-filter: blur(${localStorage.getItem('blur')}px) brightness(${brightness}%);`
    );

    // Hide the credit
    if (credit === 'false' && document.querySelector('#credits')) {
      document.querySelector('#credits').style.display = 'none';
    }
  }

  setCredit(photographer, unsplash, url) {
    let credit = photographer;
    if (unsplash){
      credit = `<a href='${url}' class='creditlink'>${photographer}</a> on <a href='https://unsplash.com/?utm_source=mue&utm_medium=referral' class='creditlink'>Unsplash</a>`;
    }

    document.querySelector('#photographer').insertAdjacentHTML('beforeend', ` ${credit}`); // Append credit
    document.getElementById('credit').textContent = credit;
    document.getElementById('photographerCard').textContent = credit;
  }

  // Handles setting the background if the user is offline
  doOffline() {
    const offlineImages = require('./offline_images.json');

    // Get all photographers from the keys in offlineImages.json
    const photographers = Object.keys(offlineImages);
    // Select a random photographer from the keys
    const photographer = photographers[Math.floor(Math.random() * photographers.length)];

    // Select a random image
    const randomImage = offlineImages[photographer].photo[
      Math.floor(Math.random() * offlineImages[photographer].photo.length)
    ];

    const url = `./offline-images/${randomImage}.jpg`;

    this.setBackground(url);
    this.setCredit(photographer);

    // Hide the location icon
    //document.querySelector('#backgroundCredits').style.display = 'none';
  }

  async determineMode() {
    const offlineMode = localStorage.getItem('offlineMode');

    const photoPack = JSON.parse(localStorage.getItem('photo_packs'));

    const customBackgroundColour = localStorage.getItem('customBackgroundColour');
    const customBackground = localStorage.getItem('customBackground');

    const favourited = JSON.parse(localStorage.getItem('favourite'));

    if (favourited) {
      if (offlineMode === 'true') {
        return this.doOffline();
      }

      this.setBackground(favourited.url, null, 'true');
      this.setCredit(favourited.credit);
      document.getElementById('location').textContent = favourited.location;
    } else if (photoPack) {
      if (offlineMode === 'true') {
        return this.doOffline();
      }

      const randomPhoto = photoPack[Math.floor(Math.random() * photoPack.length)];

      this.setBackground(randomPhoto.url.default, null, randomPhoto.photographer);
      this.setCredit(randomPhoto.photographer);
      document.getElementById('location').textContent = randomPhoto.location;
    } else if (customBackgroundColour) {
      this.setBackground(null, customBackgroundColour, 'false');
    } else if (customBackground !== '') {
      if (customBackground.includes('.mp4') || customBackground.includes('.webm') || customBackground.includes('.ogg')) {
        document.getElementById('backgroundImage').innerHTML = `
        <video autoplay muted loop id='backgroundVideo'>
          <source src='${customBackground}'/>
        </video>`;
      } else {
        // Local
        this.setBackground(customBackground, null, 'false');
      }
    // Online
    } else {
      if (offlineMode === 'true') {
        return this.doOffline();
      }

      // First we try and get an image from the API...
      try {
        let requestURL;

        switch (localStorage.getItem('backgroundAPI')) {
          case 'unsplash':
            requestURL = `${Constants.UNSPLASH_URL}/getImage`;
            break;
          // Defaults to Mue
          default:
            requestURL = `${Constants.API_URL}/getImage?category=Outdoors`;
            break;
        }

        // Fetch JSON data from requestURL
        const data = await (await fetch(requestURL)).json();

        // If we hit the rate limit, fallback to local images
        if (data.statusCode === 429) {
          this.doOffline();
        // Otherwise, set the background and credit from remote data
        } else {
          this.setBackground(data.file);

          if (localStorage.getItem('backgroundAPI') === 'unsplash') {
            return this.setCredit(data.photographer, 'unsplash', data.photographer_page);
          }

          this.setCredit(data.photographer);
          document.getElementById('camera').textContent = data.camera || 'N/A';
          document.getElementById('resolution').textContent = data.resolution || 'N/A';
        }

        if (data.location.replace(/[null]+/g, '') === ' ') {
          return document.querySelector('#backgroundCredits').style.display = 'none';
        }

        // Set the location tooltip
        document.getElementById('location').innerText = `${data.location.replace('null', '')}`;
      // ..and if that fails we load one locally
      } catch (e) {
        this.doOffline();
      }
    }
  }

  componentDidMount() {
    // Hide the credit
    if (localStorage.getItem('background') === 'false') {
      return document.querySelector('.photoInformation').style.display = 'none';
    }

    const backgroundColour = localStorage.getItem('customBackgroundColour');
    if (backgroundColour !== 'Disabled' && backgroundColour !== '') {
      document.querySelector('.photoInformation').style.display = 'none';
    }

    if (localStorage.getItem('animations') === 'true') {
      document.querySelector('#backgroundImage').classList.add('fade-in');
    }

    this.determineMode();
  }

  render() {
    return <div id='backgroundImage'></div>;
  }
}
