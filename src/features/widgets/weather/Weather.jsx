import variables from 'config/variables';
import { PureComponent } from 'react';

import WeatherIcon from './components/WeatherIcon';
import Expanded from './components/Expanded';

import EventBus from 'utils/eventbus';

import { getWeather } from './api/getWeather.js';

import './weather.scss';

class WeatherWidget extends PureComponent {
  constructor() {
    super();
    this.state = {
      location: localStorage.getItem('location') || 'London',
      done: false,
    };
  }

  async componentDidMount() {
    EventBus.on('refresh', async (data) => {
      // Convert the callback function to an async function
      if (data === 'weather') {
        const weatherData = await getWeather(this.state.location, this.state.done);
        this.setState(weatherData);
      }
    });

    const weatherData = await getWeather(this.state.location, this.state.done);
    this.setState(weatherData);
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
        {this.state.done === false ? <h1>cheese</h1> : <h1>loading finished</h1>}
        <div className="weatherCore">
          <div className="iconAndTemps">
            <div className="weathericon">
              <WeatherIcon name={this.state.icon} />
              <span>{`${this.state.weather.temp}${this.state.temp_text}`}</span>
            </div>
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
        </div>
        {weatherType >= 3 && (
          <Expanded weatherType={weatherType} state={this.state} variables={variables} />
        )}
      </div>
    );
  }
}

export { WeatherWidget as default, WeatherWidget };
