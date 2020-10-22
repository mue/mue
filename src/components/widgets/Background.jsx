import React from 'react';
import * as Constants from '../../modules/constants';

export default class Background extends React.PureComponent {
  gradientStyleBuilder(gradientSettings) {
    const { type, angle, gradient } = gradientSettings;
    let style = `background: ${gradient[0].colour};`;
    if (gradient.length > 1) {
      //Note: Append the gradient for additional browser support.
      const stepStyles = gradient.map(g => ` ${g.colour} ${g.stop}%`).join();
      style += ` background: ${type}-gradient(${angle}deg,${stepStyles})`;
    }
    return style;
  }

  setBackground(url, colour, credit) { // Sets the attributes of the background image
    let gradientSettings = '';
    try {
      gradientSettings = JSON.parse(colour);
    } catch (e) {
      const hexColorRegex = /#[0-9a-fA-F]{6}/s;
      if (hexColorRegex.exec(colour)) {
        //colour use to be simply a hex colour or a NULL value before it was a JSON object. This automatically upgrades the hex colour value to the new standard. (NULL would not trigger an exception)
        gradientSettings = { "type": "linear", "angle": "180", "gradient": [{ "colour": colour, "stop": 0 }] };
        localStorage.setItem('customBackgroundColour', JSON.stringify(gradientSettings));
      }
    }
    const background = typeof gradientSettings === 'object' && gradientSettings !== null ? this.gradientStyleBuilder(gradientSettings) : `background-image: url(${url})`;
    let brightness = localStorage.getItem('brightness');
    if (localStorage.getItem('brightnessTime') && new Date().getHours() > 18) brightness = 75;

    document.querySelector('#backgroundImage').setAttribute(
      'style',
      `${background}; -webkit-filter: blur(${localStorage.getItem('blur')}px) brightness(${brightness}%);`
    );

    if (credit === 'false' && document.querySelector('#credits')) document.querySelector('#credits').style.display = 'none'; // Hide the credit
  }

  setCredit(photographer, unsplash, url) {
    let credit = photographer;
    if (unsplash) credit = `<a href='${url}' class='creditlink'>${photographer}</a> on <a href='https://unsplash.com/?utm_source=mue&utm_medium=referral' class='creditlink'>Unsplash</a>`;
    document.querySelector('#photographer').insertAdjacentHTML("beforeend", ` ${credit}`); // Append credit
    document.getElementById('credit').textContent = credit;
  }

  doOffline() { // Handles setting the background if the user is offline
    const offlineImages = require('../../modules/offlineImages.json');
    const photographers = Object.keys(offlineImages); // Get all photographers from the keys in offlineImages.json
    const photographer = photographers[Math.floor(Math.random() * photographers.length)]; // Select a random photographer from the keys
    const randomImage = offlineImages[photographer].photo[
      Math.floor(Math.random() * offlineImages[photographer].photo.length)
    ]; // Select a random image
    const url = `../offline-images/${randomImage}.jpg`;

    this.setBackground(url);
    this.setCredit(photographer);

    document.querySelector('#backgroundCredits').style.display = 'none'; // Hide the location icon
  }

  async determineMode() {
    const offlineMode = localStorage.getItem('offlineMode');

    const photoPack = JSON.parse(localStorage.getItem('photo_packs'));
    const customBackgroundColour = localStorage.getItem('customBackgroundColour');
    const customBackground = localStorage.getItem('customBackground');
    const favourited = JSON.parse(localStorage.getItem('favourite'));

    if (favourited) {
      if (offlineMode === 'true') return this.doOffline();
      this.setBackground(favourited.url, null, 'true');
      this.setCredit(favourited.credit);
      document.getElementById('location').textContent = favourited.location;
    } else if (photoPack) {
      if (offlineMode === 'true') return this.doOffline();
      const randomPhoto = photoPack[Math.floor(Math.random() * photoPack.length)];
      this.setBackground(randomPhoto.url.default, null, randomPhoto.photographer);
      this.setCredit(randomPhoto.photographer);
      document.getElementById('location').textContent = randomPhoto.location;
    } else if (customBackgroundColour) {
      this.setBackground(null, customBackgroundColour, 'false');
    } else if (customBackground !== '') { // Local
      this.setBackground(customBackground, null, 'false');
    } else { // Online
      if (offlineMode === 'true') return this.doOffline();
      try { // First we try and get an image from the API...
        const enabled = localStorage.getItem('webp');
        let requestURL;

        switch (localStorage.getItem('backgroundAPI')) {
          case 'unsplash':
            requestURL = `${Constants.UNSPLASH_URL}/getImage`;
            break;
          default: // Defaults to Mue
            if (localStorage.getItem('supportswebp') === 'true' && enabled === 'true') requestURL = `${Constants.API_URL}/getImage?webp=true`;
            else requestURL = `${Constants.API_URL}/getImage?category=Outdoors`;
            break;
        }

        const data = await (await fetch(requestURL)).json(); // Fetch JSON data from requestURL

        if (data.statusCode === 429) this.doOffline(); // If we hit the rate limit, fallback to local images
        else { // Otherwise, set the background and credit from remote data
          this.setBackground(data.file);
          if (localStorage.getItem('backgroundAPI') === 'unsplash') return this.setCredit(data.photographer, 'unsplash', data.photographer_page);
          this.setCredit(data.photographer);
        }

        if (data.location.replace(/[null]+/g, '') === ' ') return document.querySelector('#backgroundCredits').style.display = 'none';
        document.getElementById('location').innerText = `${data.location.replace('null', '')}`; // Set the location tooltip
      } catch (e) { // ..and if that fails we load one locally
        this.doOffline();
      }
    }
  }

  componentDidMount() {
    if (localStorage.getItem('background') === 'false') return document.querySelector('#credits').style.display = 'none'; // Hide the credit
    if (localStorage.getItem('animations') === 'true') document.querySelector('#backgroundImage').classList.add('fade-in');
    this.determineMode();
  }

  render() {
    return <div id='backgroundImage'></div>;
  }
}
