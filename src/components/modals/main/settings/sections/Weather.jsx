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
    this.language = window.language.modals.main.settings;
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
    const language = window.language.modals.main.settings.sections.weather;

    const tempFormat = [
      {
        name: language.temp_format.celsius + ' (°C)',
        value: 'celsius'
      },
      {
        name: language.temp_format.fahrenheit + ' (°F)',
        value: 'fahrenheit'
      },
      {
        name: language.temp_format.kelvin + ' (K)',
        value: 'kelvin'
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
        <Slider title={window.language.modals.main.settings.sections.appearance.accessibility.widget_zoom} name='zoomWeather' min='10' max='400' default='100' display='%' category='weather'/>

        <h3>{language.extra_info.title}</h3>
        <Checkbox name='showlocation' text={language.extra_info.show_location} category='weather'/>
        <Checkbox name='weatherdescription' text={language.extra_info.show_description} category='weather'/>
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
