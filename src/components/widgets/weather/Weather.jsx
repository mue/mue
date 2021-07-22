import React from 'react';

import EventBus from '../../../modules/helpers/eventbus';

import WeatherIcon from './WeatherIcon';
import WindDirectionIcon from './WindDirectionIcon';
import { WiHumidity, WiWindy, WiBarometer, WiCloud } from 'weather-icons-react';

import './weather.scss';

export default class Weather extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      location: localStorage.getItem('location') || 'London',
      icon: '',
      temp_text: '',
      weather: {
        temp: '',
        description: '',
        temp_min: '',
        temp_max: '',
        humidity: '',
        wind_speed: '',
        wind_degrees: '',
        cloudiness: '',
        visibility: '',
        pressure: ''
      }
    };
  }

  async getWeather() {
    if (localStorage.getItem('offlineMode') === 'true') {
      return null;
    }

    document.querySelector('.weather').style.fontSize = `${Number((localStorage.getItem('zoomWeather') || 100) / 100)}em`;

    let data = {
      weather: [
        {
          description: this.state.weather.description,
          icon: this.state.icon
        }
      ],
      main: {
        temp: this.state.weather.original_temp,
        temp_min: this.state.weather.original_temp_min,
        temp_max: this.state.weather.original_temp_max,
        humidity: this.state.weather.humidity,
        pressure: this.state.weather.pressure
      },
      visibility: this.state.weather.visibility,
      wind: {
        speed: this.state.weather.wind_speed,
        deg: this.state.weather.wind_degrees
      },
      clouds: {
        all: this.state.weather.cloudiness
      }
    };

    const tempFormat = localStorage.getItem('tempformat');

    if (!this.state.weather.temp) {
      data = await (await fetch(window.constants.PROXY_URL + `/weather/current?city=${this.state.location}&lang=${localStorage.getItem('language')}&format=${tempFormat}`)).json();
    }

    if (data.cod === '404') {
      return this.setState({
        location: window.language.widgets.weather.not_found
      });
    }

    let tempText;
    switch (tempFormat) {
      case 'celsius':
        tempText = '°C';
        break;
      case 'fahrenheit':
        tempText = '°F';
        break;
      default:
        tempText = 'K';
        break;
    }

    this.setState({
      icon: data.weather[0].icon,
      temp_text: tempText,
      weather: {
        temp: Math.round(data.main.temp),
        description: data.weather[0].description,
        temp_min: Math.round(data.main.temp_min),
        temp_max: Math.round(data.main.temp_max),
        humidity: data.main.humidity,
        wind_speed: data.wind.speed,
        wind_degrees: data.wind.deg,
        cloudiness: data.clouds.all,
        visibility: data.visibility,
        pressure: data.main.pressure,
        original_temp: data.main.temp,
        original_temp_min: data.main.temp_min,
        original_temp_max: data.main.temp_max
      }
    });

    document.querySelector('.weather svg').style.fontSize = `${0.95 * Number((localStorage.getItem('zoomWeather') || 100) / 100)}em`;
  }
  
  componentDidMount() {
    EventBus.on('refresh', (data) => {
      if (data === 'weather') {
        this.getWeather();
      }
    });
    this.getWeather();
  }

  componentWillUnmount() {
    EventBus.remove('refresh');
  }

  render() {
    const enabled = (setting) => {
      return (localStorage.getItem(setting) === 'true');
    };

    if (enabled('offlineMode')) {
      return null;
    }

    if (this.state.location === window.language.widgets.weather.not_found) {
      return (<div className='weather'>
        <span className='loc'>{this.state.location}</span>
      </div>);
    }

    const minmax = () => {
      const mintemp = enabled('mintemp');
      const maxtemp = enabled('maxtemp');
    
      if (!mintemp && !maxtemp) {
        return null;
      } else if (mintemp && !maxtemp) {
        return <><br/>{this.state.weather.temp_min + this.state.temp_text}</>;
      } else if (maxtemp && !mintemp) {
        return <><br/>{this.state.weather.temp_max + this.state.temp_text}</>;
      } else {
        return <><br/>{this.state.weather.temp_min + this.state.temp_text} {this.state.weather.temp_max + this.state.temp_text}</>;
      }
    };

    return (
      <div className='weather'>
        <WeatherIcon name={this.state.icon}/>
        <span>{this.state.weather.temp + this.state.temp_text}</span>
        {enabled('weatherdescription') ? <span className='loc'><br/>{this.state.weather.description}</span> : null}
        <span className='minmax'>{minmax()}</span>
        {enabled('humidity') ? <span className='loc'><br/><WiHumidity/>{this.state.weather.humidity}%</span> : null}
        {enabled('windspeed') ? <span className='loc'><br/><WiWindy/>{this.state.weather.wind_speed}<span className='minmax'> m/s</span> {enabled('windDirection') ? <WindDirectionIcon degrees={this.state.weather.wind_degrees}/> : null}</span> : null}
        {enabled('cloudiness') ? <span className='loc'><br/><WiCloud/>{this.state.weather.cloudiness}%</span> : null}
        {enabled('visibility') ? <span className='loc'><br/>{this.state.weather.visibility} {window.language.widgets.weather.meters}</span> : null}
        {enabled('atmosphericpressure') ? <span className='loc'><br/><WiBarometer/>{this.state.weather.pressure}<span className='minmax'> hPa</span></span> : null}
        <br/>
        {enabled('showlocation') ? <span className='loc'>{this.state.location}</span> : null}
      </div>
    );
  }
}
