import React from 'react';
import WeatherIcon from './WeatherIcon';

import { WiHumidity, WiWindy } from 'weather-icons-react';

import './weather.scss';

export default class Weather extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      location: localStorage.getItem('location') || 'London',
      icon: '',
      temp_text: '',
      weather: {
        title: '',
        temp: '',
        temp_min: '',
        temp_max: '',
        humidity: '',
        windspeed: '',
        pressure: ''
      }
    };
  }

  async getWeather() {
    const data = await (await fetch (window.constants.WEATHER_URL + `?city=${this.state.location}`)).json();

    let temp = data.main.temp;
    let temp_min = data.main.temp_max 
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
      default: break;
    }

    this.setState({
      icon: data.weather[0].icon,
      temp_text: temp_text,
      weather: {
        title: data.weather[0].main,
        temp: Math.round(temp),
        temp_min: Math.round(temp_min),
        temp_max: Math.round(temp_max),
        humidity: data.main.humidity,
        windspeed: data.wind.speed,
        pressure: data.main.pressure
      }
    });
  }
  
  componentDidMount() {
    this.getWeather();
  }

  render() {
    const checkValue = (setting) => {
      return (localStorage.getItem(setting) === 'true');
    };
  
    return (
      <div className='weather'>
        <WeatherIcon name={this.state.icon}/>
        <span>{this.state.weather.temp + this.state.temp_text}</span>
        <br/>
        <span className='minmax'>{checkValue('mintemp') ? this.state.weather.temp_min + this.state.temp_text : null} {checkValue('maxtemp') ? this.state.weather.temp_max + this.state.temp_text : null}</span>
        {checkValue('humidity') ? <span className='loc'><br/><WiHumidity/>{this.state.weather.humidity}%</span> : null}
        {checkValue('windspeed') ? <span className='loc'><br/><WiWindy/>{this.state.weather.windspeed}<span className='minmax'> m/s</span></span> : null}
        {checkValue('atmosphericpressure') ? <span className='loc'><br/>{this.state.weather.pressure}<span className='minmax'> hPa</span></span> : null}
        <br/>
        <span className='loc'>{this.state.location}</span>
        {/*<span>{this.state.weather.title}</span>*/}
      </div>
    );
  }
}