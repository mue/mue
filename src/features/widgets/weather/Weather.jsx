import variables from 'config/variables';
import { PureComponent } from 'react';

import WeatherIcon from './WeatherIcon';
import Expanded from './Expanded';

import EventBus from 'modules/helpers/eventbus';

import './weather.scss';

const convertTemperature = (temp, format) => {
  if (format === 'celsius') {
    return Math.round(temp - 273.15);
  } else if (format === 'fahrenheit') {
    return Math.round((temp - 273.15) * 1.8 + 32);
  }
  return Math.round(temp);
};

export default class WeatherSettings extends PureComponent {
  constructor() {
    super();
    this.state = {
      location: localStorage.getItem('location') || 'London',
      done: false,
    };
  }

  async getWeather() {
    if (this.state.done === true) {
      return;
    }

    const zoomWeather = `${Number((localStorage.getItem('zoomWeather') || 100) / 100)}em`;
    document.querySelector('.weather').style.fontSize = zoomWeather;

    try {
      const response = await fetch(
        variables.constants.API_URL +
          `/weather?city=${this.state.location}&language=${variables.languagecode}`,
      );

      if (!response.ok) {
        this.setState({
          location: variables.getMessage('modals.main.error_boundary.title'),
          done: true,
        });
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.status === 404) {
        return this.setState({
          location: variables.getMessage('widgets.weather.not_found'),
          done: true,
        });
      }

      const { temp, temp_min, temp_max, feels_like } = data.main;
      const tempFormat = localStorage.getItem('tempformat');

      const tempSymbols = {
        celsius: '°C',
        kelvin: 'K',
        fahrenheit: '°F',
      };

      this.setState({
        icon: data.weather[0].icon,
        temp_text: tempSymbols[tempFormat] || 'K',
        weather: {
          temp: convertTemperature(temp, tempFormat),
          description: data.weather[0].description,
          temp_min: convertTemperature(temp_min, tempFormat),
          temp_max: convertTemperature(temp_max, tempFormat),
          feels_like: convertTemperature(feels_like, tempFormat),
          humidity: data.main.humidity,
          wind_speed: data.wind.speed,
          wind_degrees: data.wind.deg,
          cloudiness: data.clouds.all,
          visibility: data.visibility,
          pressure: data.main.pressure,
        },
        done: true,
      });
    } catch (error) {
      console.error('Fetch Error: ', error);
    }

    document.querySelector('.top-weather svg').style.fontSize = zoomWeather;
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

    if (!this.state.weather) {
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
              <span>{`${this.state.weather.temp}${this.state.temp_text}`}</span>
            </div>
          )}
          {weatherType >= 2 && (
            <span className="minmax">
              <span className="subtitle">{`${this.state.weather.temp_min}${this.state.temp_text}`}</span>
              <span className="subtitle">{`${this.state.weather.temp_max}${this.state.temp_text}`}</span>
            </span>
          )}
        </div>
        {weatherType >= 2 && (
          <div className="extra-info">
            <span>
              {variables.getMessage('widgets.weather.feels_like', {
                amount: `${this.state.weather.feels_like}${this.state.temp_text}`,
              })}
            </span>
            <span className="loc">{this.state.location}</span>
          </div>
        )}
        {weatherType >= 3 && (
          <Expanded weatherType={weatherType} state={this.state} variables={variables} />
        )}
      </div>
    );
  }
}
