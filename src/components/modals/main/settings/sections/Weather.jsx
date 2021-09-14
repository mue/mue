import variables from 'modules/variables';
import { PureComponent } from 'react';

import Switch from '../Switch';
import Radio from '../Radio';
import Checkbox from '../Checkbox';
import Slider from '../Slider';

export default class TimeSettings extends PureComponent {
  constructor() {
    super();
    this.state = {
      location: localStorage.getItem('location') || 'London'
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
      const data = await (await fetch(`${window.constants.PROXY_URL}/weather/autolocation?lat=${position.coords.latitude}&lon=${position.coords.longitude}`)).json();
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
    const getMessage = (languagecode, text) => variables.language.getMessage(languagecode, text);
    const languagecode = variables.languagecode;

    const tempFormat = [
      {
        name: getMessage(languagecode, 'modals.main.settings.sections.weather.temp_format.celsius') + ' (°C)',
        value: 'celsius'
      },
      {
        name: getMessage(languagecode, 'modals.main.settings.sections.weather.temp_format.fahrenheit') + ' (°F)',
        value: 'fahrenheit'
      },
      {
        name: getMessage(languagecode, 'modals.main.settings.sections.weather.temp_format.kelvin') + ' (K)',
        value: 'kelvin'
      }
    ];
      
    return (
      <>
        <h2>{getMessage(languagecode, 'modals.main.settings.sections.weather.title')}</h2>
        <Switch name='weatherEnabled' text={getMessage(languagecode, 'modals.main.settings.enabled')} category='widgets'/>
        <ul>
          <p>{getMessage(languagecode, 'modals.main.settings.sections.weather.location')} <span className='modalLink' onClick={() => this.getAuto()}>{getMessage(languagecode, 'modals.main.settings.sections.weather.auto')}</span></p>
          <input type='text' value={this.state.location} onChange={(e) => this.changeLocation(e)}></input>
        </ul>
        <br/>
        <Radio name='tempformat' title={getMessage(languagecode, 'modals.main.settings.sections.weather.temp_format.title')} options={tempFormat} category='weather'/>
        <Slider title={getMessage(languagecode, 'modals.main.settings.sections.appearance.accessibility.widget_zoom')} name='zoomWeather' min='10' max='400' default='100' display='%' category='weather'/>

        <h3>{getMessage(languagecode, 'modals.main.settings.sections.weather.extra_info.title')}</h3>
        <Checkbox name='showlocation' text={getMessage(languagecode, 'modals.main.settings.sections.weather.extra_info.show_location')} category='weather'/>
        <Checkbox name='weatherdescription' text={getMessage(languagecode, 'modals.main.settings.sections.weather.extra_info.show_description')} category='weather'/>
        <Checkbox name='cloudiness' text={getMessage(languagecode, 'modals.main.settings.sections.weather.extra_info.cloudiness')} category='weather'/>
        <Checkbox name='humidity' text={getMessage(languagecode, 'modals.main.settings.sections.weather.extra_info.humidity')} category='weather'/>
        <Checkbox name='visibility' text={getMessage(languagecode, 'modals.main.settings.sections.weather.extra_info.visibility')} category='weather'/>
        <Checkbox name='windspeed' text={getMessage(languagecode, 'modals.main.settings.sections.weather.extra_info.wind_speed')} category='weather'/>
        <Checkbox name='windDirection' text={getMessage(languagecode, 'modals.main.settings.sections.weather.extra_info.wind_direction')} category='weather'/>
        <Checkbox name='mintemp' text={getMessage(languagecode, 'modals.main.settings.sections.weather.extra_info.min_temp')} category='weather'/>
        <Checkbox name='maxtemp' text={getMessage(languagecode, 'modals.main.settings.sections.weather.extra_info.max_temp')} category='weather'/>
        <Checkbox name='atmosphericpressure' text={getMessage(languagecode, 'modals.main.settings.sections.weather.extra_info.atmospheric_pressure')} category='weather'/>
      </>
    );
  }
}
