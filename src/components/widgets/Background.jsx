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
      'style', `background-image: url(../offline-images/${randomImage}.jpeg); -webkit-filter:blur(${localStorage.getItem('blur')}px);` 
    ); // Set background and blur
    
    const creditElem = document.getElementById('photographer');
    creditElem.append(` ${photographer} (Pexels)`); // Set the credit

    document.querySelector('#backgroundCredits').style.display = 'none'; // Hide the location icon
  }

  async setBackground() {
    if (localStorage.getItem('offlineMode') === 'true') return this.doOffline();

    const photoPack = JSON.parse(localStorage.getItem('photo_packs'));
    if (photoPack) {
      let background = photoPack[Math.floor(Math.random() * photoPack.length)];
      document.getElementById('backgroundCredits').style.display = 'none'; // Hide the location icon
      document.getElementById('photographer').style.display = 'none';
      return document.getElementById('backgroundImage').setAttribute('style', `-webkit-filter:blur(${localStorage.getItem('blur')}px); background-image: url(${background.url.default})`); // Set background and blur etc
    }

    const colour = localStorage.getItem('customBackgroundColour');
    if (colour) {
      document.getElementById('backgroundCredits').style.display = 'none'; // Hide the location icon
      document.getElementById('photographer').style.display = 'none';
      return document.getElementById('backgroundImage').setAttribute('style', `-webkit-filter:blur(${localStorage.getItem('blur')}px); background-color: ${colour}`); // Set background and blur etc
    }

    const custom = localStorage.getItem('customBackground');
    if (custom !== '') {
      document.getElementById('backgroundCredits').style.display = 'none'; // Hide the location icon
      document.getElementById('photographer').style.display = 'none';
      return document.getElementById('backgroundImage').setAttribute('style', `-webkit-filter:blur(${localStorage.getItem('blur')}px); background-image: url(${custom})`); // Set background and blur etc
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

        document.getElementById('backgroundImage').setAttribute('style', `-webkit-filter:blur(${localStorage.getItem('blur')}px); background-image: url(${data.file})`); // Set background and blur etc
        let credit = document.getElementById('photographer');
        credit.innerText = `${credit.innerText} ${data.photographer}`; // Set the credit
        if (data.location.replace(/[null]+/g, '') === ' ') return document.getElementById('backgroundCredits').style.display = 'none';
        document.getElementById('location').innerText = `${data.location.replace('null', '')}`; // Set the location tooltip
      } catch (e) { // ..and if that fails we load one locally
        this.doOffline();
      }
    }
  }

  componentDidMount() {
    if (localStorage.getItem('background') === 'false') {
      document.getElementById('photographer').style.display = 'none';
      return document.getElementById('backgroundCredits').style.display = 'none';
    }
    if (localStorage.getItem('animations') === 'true') document.getElementById('backgroundImage').classList.add('fade-in');
    this.setBackground();
  }

  render() {
    return <div id='backgroundImage'></div>;
  }
}