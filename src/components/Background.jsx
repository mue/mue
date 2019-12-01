//* Imports
import React from 'react';

export default class Background extends React.Component {
  async setBackground() {    
    try { // First we try and get an image from the API...
      let data = await fetch('https://api.muetab.xyz/getImage?category=Outdoors');
      data = await data.json(); 

      document.getElementById('root').style.backgroundImage = `url(${data.file})`;
      document.getElementById('photographer').innerText = `Photo by ${data.photographer}`;
      document.getElementById('location').innerText = `${data.location}`;   
    } catch (e) { // ..and if that fails we load one locally
      let photographer;
      const photo = Math.floor(Math.random() * (20 - 1 + 1)) + 1; // There are 20 images in the offline-images folder
      document.getElementById('backgroundCredits').style.display = 'none';
      // eslint-disable-next-line default-case
      switch (photo) { // Select photographer based on image file number
        case 1: {
          photographer = 'Tirachard Kumtanom (Pexels)';
          break;
        }
        case 2: {
          photographer = 'Pixabay (Pexels)';
          break;
        }
        case 3: {
          photographer = 'Pixabay (Pexels)';
          break;
        }
        case 4: {
          photographer = 'Sohail Na (Pexels)';
          break;
        }
        case 5: {
          photographer = 'Unknown (Pexels)';
          break;
        }
        case 6: {
          photographer = 'Unknown (Pexels)';
          break;
        }
        case 7: {
          photographer = 'Miriam Espacio (Pexels)';
          break;
        }
        case 8: {
          photographer = 'Unknown (Pexels)';
          break;
        }
        case 9: {
          photographer = 'Pixabay (Pexels)';
          break;
        }
        case 10: {
          photographer = 'NO NAME (Pexels)';
          break;
        }
        case 11: {
          photographer = 'Pixabay (Pexels)';
          break;
        }
        case 12: {
          photographer = 'Unknown (Pexels)';
          break;
        }
        case 13: {
          photographer = 'Pixabay (Pexels)';
          break;
        }
        case 14: {
          photographer = 'Pixabay (Pexels)';
          break;
        }
        case 15: {
          photographer = 'Pixabay (Pexels)';
          break;
        }
        case 16: {
          photographer = 'Unknown (Pexels)';
          break;
        }
        case 17: {
          photographer = 'Unknown (Pexels)';
          break;
        }
        case 18: {
          photographer = 'Unknown (Pexels)';
          break;
        }
        case 19: {
          photographer = 'Unknown (Pexels)';
          break;
        }
        case 20: {
          photographer = 'Fabian Wiktor (Pexels)';
          break;
        }
      }
      document.getElementById('photographer').innerText = `Photo by ${photographer}`;
      document.getElementById('root').style.backgroundImage = `url(../offline-images/${photo}.jpeg)`;
    }
  }

  componentDidMount() {
    this.setBackground();
  }

  render() {
    return null; // React gets annoyed if I don't put anything here or use "return;"
  }
}