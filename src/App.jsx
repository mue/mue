//* Imports
import React from 'react';
import Background from './components/Background';
import Clock from './components/Clock';
import Greeting from './components/Greeting';
import Quote from './components/Quote';
import Search from './components/Search';
import Credit from './components/Credit';
import './css/index.css';

//* App
export default class App extends React.Component {
  // Render all the components
  render() {
    return (
      <React.Fragment>
        <Background/>
        <Search/>
          <div id='center'>
              <Greeting/>
              <Clock/> 
              <Quote/>
              <Credit/>
          </div>
      </React.Fragment>
    );
  }
}
