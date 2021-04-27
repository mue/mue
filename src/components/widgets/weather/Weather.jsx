import React from 'react';

import EventBus from '../../../modules/helpers/eventbus';

import WeatherIcon from './WeatherIcon';
//import WindDirectionIcon from './WindDirectionIcon';
import { WiHumidity, WiWindy, WiBarometer } from 'weather-icons-react';

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
        temp_min: '',
        temp_max: '',
        humidity: '',
        wind_speed: '',
        wind_degrees: '',
        pressure: ''
      }
    };
  }

  async getWeather() {
    if (localStorage.getItem('offlineMode') === 'true') {
      return null;
    }

    let data = {
      weather: [
        {
          icon: this.state.icon
        }
      ],
      wind: {
        speed: this.state.weather.wind_speed,
        deg: this.state.weather.wind_degrees
      },
      main: {
        temp: this.state.weather.original_temp,
        temp_min: this.state.weather.original_temp_min,
        temp_max: this.state.weather.original_temp_max,
        humidity: this.state.weather.humidity,
        pressure: this.state.weather.pressure
      }
    };

    if (!this.state.weather.temp) {
      data = await (await fetch (window.constants.WEATHER_URL + `/current?city=${this.state.location}`)).json();
    }

    if (data.cod === '404') {
      return this.setState({
        location: window.language.widgets.weather.not_found
      });
    }

    let temp = data.main.temp;
    let temp_min = data.main.temp_min; 
    let temp_max = data.main.temp_max;
    let temp_text = 'K';

    switch (localStorage.getItem('tempformat')) {
      case 'celsius':
        temp = temp - 273.15;
        temp_min = temp_min - 273.15;
        temp_max = temp_max - 273.15;
        temp_text = '°C';
        break;
      case 'fahrenheit':
        temp = ((temp - 273.15) * 1.8) + 32;
        temp_min = ((temp_min - 273.15) * 1.8) + 32;
        temp_max = ((temp_max - 273.15) * 1.8) + 32;
        temp_text = '°F';
        break;
      // kelvin
      default: break;
    }

    this.setState({
      icon: data.weather[0].icon,
      temp_text: temp_text,
      weather: {
        temp: Math.round(temp),
        temp_min: Math.round(temp_min),
        temp_max: Math.round(temp_max),
        humidity: data.main.humidity,
        wind_speed: data.wind.speed,
        wind_degrees: data.wind.deg,
        pressure: data.main.pressure,
        original_temp: data.main.temp,
        original_temp_min: data.main.temp_min,
        original_temp_max: data.main.temp_max
      }
    });
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
        <span className='minmax'>{minmax()}</span>
        {enabled('humidity') ? <span className='loc'><br/><WiHumidity/>{this.state.weather.humidity}%</span> : null}
        {enabled('windspeed') ? <span className='loc'><br/><WiWindy/>{this.state.weather.wind_speed}<span className='minmax'> m/s</span>{/*<WindDirectionIcon degrees={this.state.weather.wind_degrees}/>*/}</span> : null}
        {enabled('atmosphericpressure') ? <span className='loc'><br/><WiBarometer/>{this.state.weather.pressure}<span className='minmax'> hPa</span></span> : null}
        <br/>
        {enabled('showlocation') ? <span className='loc'>{this.state.location}</span> : null}
      </div>
    );
  }
}