import variables from 'modules/variables';
import { PureComponent } from 'react';

import WeatherIcon from './WeatherIcon';
import Expanded from './Expanded';

import EventBus from 'modules/helpers/eventbus';

import './weather.scss';

export default class Weather extends PureComponent {
  constructor() {
    super();
    this.state = {
      location: localStorage.getItem('location') || 'London',
      done: false,
    };
  }

  async getWeather() {
    const zoomWeather = `${Number((localStorage.getItem('zoomWeather') || 100) / 100)}em`;
    document.querySelector('.weather').style.fontSize = zoomWeather;

    if (this.state.done === true) {
      return;
    }

    const data = await (
      await fetch(
        variables.constants.PROXY_URL +
          `/weather/current?city=${this.state.location}&lang=${variables.languagecode}`,
      )
    ).json();

    if (data.cod === '404') {
      return this.setState({
        location: variables.getMessage('widgets.weather.not_found'),
      });
    }

    let temp = data.main.temp;
    let temp_min = data.main.temp_min;
    let temp_max = data.main.temp_max;
    let temp_feels_like = data.main.temp_feels_like;
    let temp_text = 'K';

    if (localStorage.getItem('tempformat') === 'celsius') {
      temp -= 273.15;
      temp_min -= 273.15;
      temp_max -= 273.15;
      temp_feels_like -= 273.15;
      temp_text = '°C';
    } else {
      temp = (temp - 273.15) * 1.8 + 32;
      temp_min = (temp_min - 273.15) * 1.8 + 32;
      temp_max = (temp_max - 273.15) * 1.8 + 32;
      temp_feels_like = (temp_feels_like - 273.15) * 1.8 + 32;
      temp_text = '°F';
    }

    this.setState({
      icon: data.weather[0].icon,
      temp_text,
      weather: {
        temp: Math.round(temp),
        description: data.weather[0].description,
        temp_min: Math.round(temp_min),
        temp_max: Math.round(temp_max),
        temp_feels_like: Math.round(temp_feels_like),
        humidity: data.main.humidity,
        wind_speed: data.wind.speed,
        wind_degrees: data.wind.deg,
        cloudiness: data.clouds.all,
        visibility: data.visibility,
        pressure: data.main.pressure
      },
      done: true
    });

    document.querySelector('.tweather svg').style.fontSize = zoomWeather;
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
    EventBus.off('refresh');
  }

  render() {
    if (this.state.done === false) {
      return <div className="weather"></div>;
    }

    const weatherType = localStorage.getItem('weatherType') || 1;

    if (this.state.location === variables.getMessage('weather.not_found')) {
      return (
        <div className="weather">
          <span className="loc">{this.state.location}</span>
        </div>
      );
    }
  
    return (
      <div className="weather">
        <div className="top-weather">
          {weatherType >= 1 && (
            <div>
              <WeatherIcon name={this.state.icon} />
              <span>{this.state.weather.temp + this.state.temp_text}</span>
            </div>
          )}
          {weatherType >= 2 && (
            <span className="minmax">
              <span className="subtitle">{this.state.weather.temp_min + this.state.temp_text}</span>
              <span className="subtitle">{this.state.weather.temp_max + this.state.temp_text}</span>
            </span>
          )}
        </div>
        {weatherType >= 2 && (
          <div className="extra-info">
            <span>
              {variables.getMessage('widgets.weather.feels_like', {
                amount: this.state.weather.temp_feels_like + this.state.temp_text,
              })}
            </span>
            <span className="loc">{this.state.location}</span>
          </div>
        )}
        {weatherType >= 3 ? <Expanded weatherType={weatherType} state={this.state} variables={variables}/> : null}
      </div>
    );
  }
}
