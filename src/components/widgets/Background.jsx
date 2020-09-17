import React from 'react';
import * as Constants from '../../modules/constants';

export default class Background extends React.PureComponent {
  setBackground(url, colour, credit) { // Sets the attributes of the background image
    const background = colour ? `background-color: ${colour};` : `background-image: url(${url});`;

    document.querySelector('#backgroundImage').setAttribute(
      'style',
      `${background};
      -webkit-filter: blur(${localStorage.getItem('blur')}px);
      -webkit-filter: brightness(${localStorage.getItem('brightness')}%);`
    );

    if (credit === 'false') document.querySelector('#credits').style.display = 'none'; // Hide the credit
  }

  setCredit(photographer) {
    document.querySelector('#photographer').append(` ${photographer}`); // Append credit
    document.getElementById('credit').textContent = photographer;
  }

  doOffline() { // Handles setting the background if the user is offline
    const offlineImages = require('../../modules/offlineImages.json');
    const photographers = Object.keys(offlineImages); // Get all photographers from the keys in offlineImages.json
    const photographer = photographers[Math.floor(Math.random() * photographers.length)]; // Select a random photographer from the keys
    const randomImage = offlineImages[photographer].photo[
      Math.floor(Math.random() * offlineImages[photographer].photo.length)
    ]; // Select a random image
    const url = `../offline-images/${randomImage}.jpeg`;

    this.setBackground(url);
    this.setCredit(photographer);

    document.querySelector('#backgroundCredits').style.display = 'none'; // Hide the location icon
  }

  async determineMode() {
    if (localStorage.getItem('offlineMode') === 'true') return this.doOffline();

    const photoPack = JSON.parse(localStorage.getItem('photo_packs'));
    const customBackgroundColour = localStorage.getItem('customBackgroundColour');
    const customBackground = localStorage.getItem('customBackground');
    const favourited = JSON.parse(localStorage.getItem('favourite'));

    if (photoPack) {
      const randomPhoto = photoPack[Math.floor(Math.random() * photoPack.length)];
      this.setBackground(randomPhoto.url.default);
    } else if (customBackgroundColour) {
      this.setBackground(null, customBackgroundColour, 'false');
    } else if (favourited) {
      this.setBackground(favourited.url, null, 'true');
      this.setCredit(favourited.credit);
      document.getElementById('location').textContent = favourited.location;
    } else if (customBackground !== '') { // Local
      this.setBackground(customBackground, null, 'false');
    } else { // Online
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

        if (data.statusCode === 429) {
          this.doOffline(); // If we hit the rate limit, fallback to local images
        } else { // Otherwise, set the background and credit from remote data
          this.setBackground(data.file);
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
