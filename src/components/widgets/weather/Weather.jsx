import React from 'react';
import WeatherIcon from './WeatherIcon';

import './weather.scss';

export default class Weather extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      icon: '',
      weather: {
        title: '',
        temp: '',
        temp_min: '',
        temp_max: '',
        humidity: ''  
      }
    };
  }

  async getWeather() {
    const data = await (await fetch (window.constants.WEATHER_URL + '?city=London')).json();
    this.setState({
      icon: data.weather[0].icon,
      weather: {
        title: data.weather[0].main,
        temp: Math.round(data.main.temp - 273.15),
        temp_min: Math.round(data.main.temp_min - 273.15),
        temp_max: Math.round(data.main.temp_max - 273.15),
        humidity: data.main.humidity
      }
    });
  }
  
  componentDidMount() {
    this.getWeather();
  }

  render() {
    return (
      <div className='weather'>
        <WeatherIcon name={this.state.icon}/>
        <span>{this.state.weather.temp}&deg;C</span>
        <br />
        <span className='minmax'>{this.state.weather.temp_min}&deg;C, {this.state.weather.temp_max}&deg;C</span>
        <br />
        <span className='loc'>London</span>
        {/*<span>{this.state.weather.title}</span>*/}
      </div>
    );
  }
}