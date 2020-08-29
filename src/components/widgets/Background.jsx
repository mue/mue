import React from 'react';
import supportsWebP from 'supports-webp';
import * as Constants from '../../modules/constants';

export default class Background extends React.PureComponent {
  doOffline() { // Handles setting the background if the user is offline
    const offlineImages = require('../../modules/offlineImages.json');
    const photographers = Object.keys(offlineImages); // Get all photographers from the keys in offlineImages.json
    const photographer = photographers[Math.floor(Math.random() * photographers.length)]; // Select a random photographer from the keys
    const randomImage = offlineImages[photographer].photo[
      Math.floor(Math.random() * offlineImages[photographer].photo.length)
    ] // Select a random image

    document.querySelector('#backgroundImage').setAttribute(
      'style',
      `background-image: url(../offline-images/${randomImage}.jpeg);
      -webkit-filter: blur(${localStorage.getItem('blur')}px);
      -webkit-filter: brightness(${localStorage.getItem('brightness')}%);`
    ); // Set background and blur

    const creditElem = document.querySelector('#photographer');
    creditElem.append(` ${photographer} (Pexels)`); // Set the credit

    document.querySelector('#backgroundCredits').style.display = 'none'; // Hide the location icon
  }

  async setBackground() {
    if (localStorage.getItem('offlineMode') === 'true') return this.doOffline();

    const photoPack = JSON.parse(localStorage.getItem('photo_packs'));
    if (photoPack) {
      let background = photoPack[Math.floor(Math.random() * photoPack.length)];

      document.getElementById('credits').style.display = 'none'; // Hide the credit
      return document.getElementById('backgroundImage').setAttribute(
        'style',
        `background-image: url(${background.url.default});
        -webkit-filter: blur(${localStorage.getItem('blur')}px);
        -webkit-filter: brightness(${localStorage.getItem('brightness')}%);`
      ); // Set background and blur etc
    }

    const colour = localStorage.getItem('customBackgroundColour');
    if (colour) {
      document.getElementById('credits').style.display = 'none'; // Hide the credit
      return document.getElementById('backgroundImage').setAttribute(
        'style',
        `background-color: ${colour};
        -webkit-filter: blur(${localStorage.getItem('blur')}px);
        -webkit-filter: brightness(${localStorage.getItem('brightness')}%);`
      ); // Set background and blur etc
    }

    const custom = localStorage.getItem('customBackground');
    if (custom !== '') {
      document.getElementById('credits').style.display = 'none'; // Hide the credit

      return document.getElementById('backgroundImage').setAttribute(
        'style',
        `background-image: url(${custom});
        -webkit-filter: blur(${localStorage.getItem('blur')}px);
        -webkit-filter: brightness(${localStorage.getItem('brightness')}%);`
      ); // Set background and blur etc
    } else {
      try { // First we try and get an image from the API...
        let requestURL;
        const enabled = localStorage.getItem('webp');
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

        document.getElementById('backgroundImage').setAttribute(
          'style',
          `background-image: url(${data.file});
          -webkit-filter: blur(${localStorage.getItem('blur')}px);
          -webkit-filter: brightness(${localStorage.getItem('brightness')}%);`
        ); // Set background and blur etc
        const creditElem = document.querySelector('#photographer');
        creditElem.append(` ${data.photographer}`); // Set the credit
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