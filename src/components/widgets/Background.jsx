import React from 'react';
import supportsWebP from 'supports-webp';
import * as Constants from '../../modules/constants';

export default class Background extends React.PureComponent {
  doOffline() {
    const photo = Math.floor(Math.random() * (Constants.OFFLINE_IMAGES - 1 + 1)) + 1; // There are 20 images in the offline-images folder
    document.getElementById('backgroundCredits').style.display = 'none'; // Hide the location icon

    let photographer; // Photographer credit
    if ([2, 3, 9, 11, 13, 14, 15].includes(photo)) photographer = 'Pixabay';  // As there are a lot of Pixabay photos, we shorten the code a bit here
    else switch (photo) {
      case 1: photographer = 'Tirachard Kumtanom'; break;
      case 4: photographer = 'Sohail Na'; break;
      case 7: photographer = 'Miriam Espacio'; break;
      case 10: photographer = 'NO NAME'; break;
      case 20: photographer = 'Fabian Wiktor'; break;
      default: photographer = 'Unknown'; break;
    }

    document.getElementById('backgroundImage').setAttribute('style', `-webkit-filter:blur(${localStorage.getItem('blur')}px); background-image: url(../offline-images/${photo}.jpeg)`); // Set background and blur etc
    let credit = document.getElementById('photographer');
    credit.innerText = `${credit.innerText} ${photographer} (Pexels)`; // Set the credit
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
        const backgroundAPI = localStorage.getItem('backgroundAPI');
        let data;

        switch (backgroundAPI) {
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
        document.getElementById('location').innerText = `${data.location}`; // Set the location tooltip
      } catch (e) { // ..and if that fails we load one locally
        this.doOffline();
      }
    }
  }

  componentDidMount() {
    if (localStorage.getItem('background') === 'false') return document.getElementById('backgroundCredits').style.display = 'none';
    if (localStorage.getItem('animations') === 'true') document.getElementById('backgroundImage').classList.add('fade-in');
    this.setBackground();
  }

  render() {
    return <div id='backgroundImage'></div>;
  }
}