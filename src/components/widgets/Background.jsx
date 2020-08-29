import React from 'react';
import supportsWebP from 'supports-webp';
import * as Constants from '../../modules/constants';

export default class Background extends React.PureComponent {
  setAttributes(url, colour) { // Sets the attributes of the background image
    let background = colour ? `background-color: ${colour};` : `background-image: url(${url});`

    document.querySelector('#backgroundImage').setAttribute(
      'style',
      `${background};
      -webkit-filter: blur(${localStorage.getItem('blur')}px);
      -webkit-filter: brightness(${localStorage.getItem('brightness')}%);`
    );
  }

  setCredit(photographer) {
    document.querySelector('#photographer').append(` ${photographer}`); // Append credit
  }

  doOffline() { // Handles setting the background if the user is offline
    const offlineImages = require('../../modules/offlineImages.json');
    const photographers = Object.keys(offlineImages); // Get all photographers from the keys in offlineImages.json
    const photographer = photographers[Math.floor(Math.random() * photographers.length)]; // Select a random photographer from the keys
    const randomImage = offlineImages[photographer].photo[
      Math.floor(Math.random() * offlineImages[photographer].photo.length)
    ] // Select a random image
    const url = `../offline-images/${randomImage}.jpeg`;

    this.setAttributes(url);
    this.setCredit(photographer);

    document.querySelector('#backgroundCredits').style.display = 'none'; // Hide the location icon
  }

  async setBackground() {
    if (localStorage.getItem('offlineMode') === 'true') return this.doOffline();

    const photoPack = JSON.parse(localStorage.getItem('photo_packs'));
    if (photoPack) {
      let background = photoPack[Math.floor(Math.random() * photoPack.length)];
      return this.setAttributes(background.url.default);
    }

    const colour = localStorage.getItem('customBackgroundColour');
    if (colour) {
      document.getElementById('credits').style.display = 'none'; // Hide the credit
      return this.setAttributes(null, colour);
    }

    const custom = localStorage.getItem('customBackground');
    if (custom !== '') { // Local
      document.getElementById('credits').style.display = 'none'; // Hide the credit
      return this.setAttributes(custom);
    } else { // Online
      try { // First we try and get an image from the API...
        const enabled = localStorage.getItem('webp');
        let requestURL;
        let data;

        switch (localStorage.getItem('backgroundAPI')) {
          case 'mue':
            if (await supportsWebP && enabled === 'true') requestURL = Constants.API_URL + '/getImage?webp=true';
            else requestURL = Constants.API_URL + '/getImage?category=Outdoors';
            break;
          case 'unsplash':
            requestURL = 'https://unsplash.muetab.xyz/getImage';
            break;
          default:
            if (await supportsWebP && enabled === 'true') requestURL = Constants.API_URL +'/getImage?webp=true';
            else requestURL = Constants.API_URL + '/getImage?category=Outdoors';
            break;
        }

        data = await fetch(requestURL);
        data = await data.json();

        if (data.statusCode === 429) return this.doOffline(); // If we hit the ratelimit, we fallback to local images

        this.setAttributes(data.file);
        this.setCredit(data.photographer);

        if (data.location.replace(/[null]+/g, '') === ' ') return document.getElementById('backgroundCredits').style.display = 'none';
        document.getElementById('location').innerText = `${data.location.replace('null', '')}`; // Set the location tooltip
      } catch (e) { // ..and if that fails we load one locally
        this.doOffline();
      }
    }
  }

  componentDidMount() {
    if (localStorage.getItem('background') === 'false') return document.getElementById('credits').style.display = 'none'; // Hide the credit
    if (localStorage.getItem('animations') === 'true') document.getElementById('backgroundImage').classList.add('fade-in');
    this.setBackground();
  }

  render() {
    return <div id='backgroundImage'></div>;
  }
}