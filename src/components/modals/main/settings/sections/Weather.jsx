import variables from 'modules/variables';
import { PureComponent } from 'react';

import Header from '../Header';
import Radio from '../Radio';
import Checkbox from '../Checkbox';
import { TextField } from '@mui/material';

export default class TimeSettings extends PureComponent {
  constructor() {
    super();
    this.state = {
      location: localStorage.getItem('location') || ''
    };
  }

  componentDidUpdate() {
    localStorage.setItem('location', this.state.location);
  }

  showReminder() {
    document.querySelector('.reminder-info').style.display = 'block';
    localStorage.setItem('showReminder', true);
  }

  changeLocation(e) {
    this.setState({ 
      location: e.target.value 
    });

    this.showReminder();
  }

  getAuto() {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const data = await (await fetch(`${variables.constants.PROXY_URL}/weather/autolocation?lat=${position.coords.latitude}&lon=${position.coords.longitude}`)).json();
      this.setState({
        location: data[0].name
      });

      this.showReminder();
    }, (error) => {
      // firefox requires this 2nd function
      console.log(error);
    }, { 
      enableHighAccuracy: true 
    });
  }

  render() {
    const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

    const tempFormat = [
      {
        name: getMessage('modals.main.settings.sections.weather.temp_format.celsius') + ' (°C)',
        value: 'celsius'
      },
      {
        name: getMessage('modals.main.settings.sections.weather.temp_format.fahrenheit') + ' (°F)',
        value: 'fahrenheit'
      },
      {
        name: getMessage('modals.main.settings.sections.weather.temp_format.kelvin') + ' (K)',
        value: 'kelvin'
      }
    ];
      
    return (
      <>
        <Header title={getMessage('modals.main.settings.sections.weather.title')} setting='weatherEnabled' category='widgets' zoomSetting='zoomWeather' zoomCategory='weather'/>
        <TextField label={getMessage('modals.main.settings.sections.weather.location')} value={this.state.location} onChange={(e) => this.changeLocation(e)} placeholder='London' varient='outlined' InputLabelProps={{ shrink: true }} />
        <span className='modalLink' onClick={() => this.getAuto()}>{getMessage('modals.main.settings.sections.weather.auto')}</span>
        <Radio name='tempformat' title={getMessage('modals.main.settings.sections.weather.temp_format.title')} options={tempFormat} category='weather'/>

        <h3>{getMessage('modals.main.settings.sections.weather.extra_info.title')}</h3>
        <Checkbox name='showlocation' text={getMessage('modals.main.settings.sections.weather.extra_info.show_location')} category='weather'/>
        <Checkbox name='weatherdescription' text={getMessage('modals.main.settings.sections.weather.extra_info.show_description')} category='weather'/>
        <Checkbox name='cloudiness' text={getMessage('modals.main.settings.sections.weather.extra_info.cloudiness')} category='weather'/>
        <Checkbox name='humidity' text={getMessage('modals.main.settings.sections.weather.extra_info.humidity')} category='weather'/>
        <Checkbox name='visibility' text={getMessage('modals.main.settings.sections.weather.extra_info.visibility')} category='weather'/>
        <Checkbox name='windspeed' text={getMessage('modals.main.settings.sections.weather.extra_info.wind_speed')} category='weather'/>
        <Checkbox name='windDirection' text={getMessage('modals.main.settings.sections.weather.extra_info.wind_direction')} category='weather'/>
        <Checkbox name='mintemp' text={getMessage('modals.main.settings.sections.weather.extra_info.min_temp')} category='weather'/>
        <Checkbox name='maxtemp' text={getMessage('modals.main.settings.sections.weather.extra_info.max_temp')} category='weather'/>
        <Checkbox name='atmosphericpressure' text={getMessage('modals.main.settings.sections.weather.extra_info.atmospheric_pressure')} category='weather'/>
      </>
    );
  }
}
