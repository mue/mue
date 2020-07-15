//* Imports
import React from 'react';
import supportsWebP from 'supports-webp';


export default class Background extends React.Component {
  async setBackground() {    
    try { // First we try and get an image from the API...
      let requestURL;
      if (await supportsWebP) requestURL = 'https://api.muetab.xyz/getImage?webp=true';
      else requestURL = 'https://api.muetab.xyz/getImage?category=Outdoors';
      let data = await fetch(requestURL);
      data = await data.json(); 

      document.getElementById('root').style.backgroundImage = `url(${data.file})`; // Set the background
      document.getElementById('photographer').innerText = `Photo by ${data.photographer}`; // Set the credit
      document.getElementById('location').innerText = `${data.location}`; // Set the location tooltip
    } catch (e) { // ..and if that fails we load one locally
      const photo = Math.floor(Math.random() * (20 - 1 + 1)) + 1; // There are 20 images in the offline-images folder
      document.getElementById('backgroundCredits').style.display = 'none'; // Hide the location icon
      let photographer; // Photographer credit
      let pixabayNumbers = [2, 3, 9, 11, 13, 14, 15]; // As there are a lot of Pixabay photos, we shorten the code a bit here
      if (pixabayNumbers.includes(photo)) photographer = 'Pixabay';
      else switch (photo) {
        default: {
          photographer = 'Unknown';
          break;
        }
        case 1: {
          photographer = 'Tirachard Kumtanom';
          break;
        }
        case 4: {
          photographer = 'Sohail Na';
          break;
        }
        case 7: {
          photographer = 'Miriam Espacio';
          break;
        }
        case 10: {
          photographer = 'NO NAME';
          break;
        }
        case 20: {
          photographer = 'Fabian Wiktor';
          break;
        }
      }
      document.getElementById('photographer').innerText = `Photo by ${photographer} (Pexels)`; // Set the credit
      document.getElementById('root').style.backgroundImage = `url(../offline-images/${photo}.jpeg)`; // Set the background
    }
  }

  componentDidMount() {
    const enabled = localStorage.getItem('background');
    if (enabled === 'false') return;
    this.setBackground();
  }

  render() {
    return null; // React gets annoyed if I don't put anything here or use "return;"
  }
}