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

  changeLocation(e) {
    this.setState({ 
      location: e.target.value 
    });

    document.querySelector('.reminder-info').style.display = 'block';
    localStorage.setItem('showReminder', true);
  }

  getAuto() {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const data = await (await fetch(`${window.constants.WEATHER_URL}/location?getAuto=true&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)).json();
      this.setState({
        location: data[0].name
      });

      document.querySelector('.reminder-info').style.display = 'block';
      localStorage.setItem('showReminder', true);
    }, (error) => {
      // firefox requires this 2nd function
      console.log(error);
    }, { 
      enableHighAccuracy: true 
    });
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
        <Switch name='weatherEnabled' text={this.language.enabled} category='widgets'/>
        <ul>
          <p>{language.location} <span className='modalLink' onClick={() => this.getAuto()}>{language.auto}</span></p>
          <input type='text' value={this.state.location} onChange={(e) => this.changeLocation(e)}></input>
        </ul>
        <br/>
        <Radio name='tempformat' title={language.temp_format.title} options={tempFormat} category='weather'/>
        <h3>{language.extra_info.title}</h3>
        <Checkbox name='showlocation' text={language.extra_info.show_location} category='weather'/>
        <Checkbox name='showtext' text={language.extra_info.show_text} category='weather'/>
        <Checkbox name='cloudiness' text={language.extra_info.cloudiness} category='weather'/>
        <Checkbox name='humidity' text={language.extra_info.humidity} category='weather'/>
        <Checkbox name='visibility' text={language.extra_info.visibility} category='weather'/>
        <Checkbox name='windspeed' text={language.extra_info.wind_speed} category='weather'/>
        <Checkbox name='windDirection' text={language.extra_info.wind_direction} category='weather'/>
        <Checkbox name='mintemp' text={language.extra_info.min_temp} category='weather'/>
        <Checkbox name='maxtemp' text={language.extra_info.max_temp} category='weather'/>
        <Checkbox name='atmosphericpressure' text={language.extra_info.atmospheric_pressure} category='weather'/>
      </>
    );
  }
}
