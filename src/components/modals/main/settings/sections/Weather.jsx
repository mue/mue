import React from 'react';

import Switch from '../Switch';
import Radio from '../Radio';
import Checkbox from '../Checkbox';

export default class TimeSettings extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      location: localStorage.getItem('location') || 'London'
    };
    this.language = window.language.modals.main.settings;
  }

  getLocation() {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(console.log, console.log);
    }
  }

  componentDidUpdate() {
    localStorage.setItem('location', this.state.location);
  }

  render() {
    const language = window.language.modals.main.settings.sections.weather;

    const tempFormat = [
      {
        'name': 'Celsius',
        'value': 'celsius'
      },
      {
        'name': 'Fahrenheit',
        'value': 'fahrenheit'
      },
      {
        'name': 'Kelvin',
        'value': 'kelvin'
      }
    ];
      
    return (
      <>
        <h2>{language.title}</h2>
        <Switch name='weatherEnabled' text={this.language.enabled} />
        <br/>
        <Radio name='tempformat' title='Temperature Format' options={tempFormat} />
        <ul>
          <p>Location <span className='modalLink' onClick={() => this.getLocation()}>Auto</span></p>
          <input type='text' value={this.state.location} onChange={(e) => this.setState({ location: e.target.value })}></input>
        </ul>
        <h3>Extra Information</h3>
        <Checkbox name='mintemp' text='Min temp'/>
        <Checkbox name='maxtemp' text='Max temp'/>
        <Checkbox name='humidity' text='Humidity'/>
        <Checkbox name='windspeed' text='Wind speed'/>
        <Checkbox name='windspeed' text='Atmospheric pressure'/>
      </>
    );
  }
}
