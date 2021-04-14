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

  componentDidUpdate() {
    localStorage.setItem('location', this.state.location);
  }

  render() {
    const language = window.language.modals.main.settings.sections.weather;

    const tempFormat = [
      {
        'name': language.temp_format.celsius + ' (°C)',
        'value': 'celsius'
      },
      {
        'name': language.temp_format.fahrenheit + ' (°F)',
        'value': 'fahrenheit'
      },
      {
        'name': language.temp_format.kelvin + ' (K)',
        'value': 'kelvin'
      }
    ];
      
    return (
      <>
        <h2>{language.title}</h2>
        <Switch name='weatherEnabled' text={this.language.enabled} category='weather'/>
        <ul>
          <p>{language.location}</p>
          <input type='text' value={this.state.location} onChange={(e) => this.setState({ location: e.target.value })}></input>
        </ul>
        <br/>
        <Radio name='tempformat' title={language.temp_format.title} options={tempFormat} category='weather'/>
        <h3>{language.extra_info.title}</h3>
        <Checkbox name='humidity' text={language.extra_info.humidity} category='weather'/>
        <Checkbox name='windspeed' text={language.extra_info.wind_speed} category='weather'/>
        <Checkbox name='mintemp' text={language.extra_info.min_temp} category='weather'/>
        <Checkbox name='maxtemp' text={language.extra_info.max_temp} category='weather'/>
        <Checkbox name='atmosphericpressure' text={language.extra_info.atmospheric_pressure} category='weather'/>
      </>
    );
  }
}
