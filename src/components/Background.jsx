//* Imports
import React from 'react';
import Fetch from 'unfetch';

export default class Background extends React.Component {
  async setBackground() {    
    try { // First we try and get an image from the API...
      let data = await Fetch('https://api.muetab.xyz/getImage?category=Outdoors');
      data = await data.json(); 

      document.getElementById('root').style.backgroundImage = `url(${data.file})`;
      document.getElementById('photographer').innerText = `Photo by ${data.photographer}`;
      document.getElementById('location').innerText = `${data.location}`;   
    } catch (e) { // ..and if that fails we load one locally
      document.getElementById('backgroundCredits').style.display = 'none';
      document.getElementById('photographer').innerText = 'Photo from Pexels';
      document.getElementById('root').style.backgroundImage = `url(../offline-images/${Math.floor(Math.random() * (20 - 1 + 1)) + 1})`; // There are 20 images in the offline-images folder
    }
  }

  componentDidMount() {
    this.setBackground();
  }

  render() {
    return null; // React gets annoyed if I don't put anything here or use "return;"
  }
}