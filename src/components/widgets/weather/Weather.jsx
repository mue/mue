import variables from 'modules/variables';
import { PureComponent } from 'react';
import { WiHumidity, WiWindy, WiBarometer, WiCloud } from 'react-icons/wi';
import { MdDisabledVisible } from 'react-icons/md';

import WeatherIcon from './WeatherIcon';
import WindDirectionIcon from './WindDirectionIcon';

import Tooltip from '../../helpers/tooltip/Tooltip';
import EventBus from 'modules/helpers/eventbus';

import './weather.scss';

export default class Weather extends PureComponent {
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
        temp_feels_like: '',
        humidity: '',
        wind_speed: '',
        wind_degrees: '',
        cloudiness: '',
        visibility: '',
        pressure: '',
      },
    };
  }

  async getWeather() {
    const zoomWeather = `${Number((localStorage.getItem('zoomWeather') || 100) / 100)}em`;
    document.querySelector('.weather').style.fontSize = zoomWeather;

    let data = {
      weather: [
        {
          description: this.state.weather.description,
          icon: this.state.icon,
        },
      ],
      main: {
        temp: this.state.weather.original_temp,
        temp_min: this.state.weather.original_temp_min,
        temp_max: this.state.weather.original_temp_max,
        temp_feels_like: this.state.weather.original_temp_feels_like,
        humidity: this.state.weather.humidity,
        pressure: this.state.weather.pressure,
      },
      visibility: this.state.weather.visibility,
      wind: {
        speed: this.state.weather.wind_speed,
        deg: this.state.weather.wind_degrees,
      },
      clouds: {
        all: this.state.weather.cloudiness,
      },
    };

    if (!this.state.weather.temp) {
      data = await (
        await fetch(
          variables.constants.PROXY_URL +
            `/weather/current?city=${this.state.location}&lang=${variables.languagecode}`,
        )
      ).json();
    }

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

    switch (localStorage.getItem('tempformat')) {
      case 'celsius':
        temp -= 273.15;
        temp_min -= 273.15;
        temp_max -= 273.15;
        temp_feels_like -= 273.15;
        temp_text = '°C';
        break;
      case 'fahrenheit':
        temp = (temp - 273.15) * 1.8 + 32;
        temp_min = (temp_min - 273.15) * 1.8 + 32;
        temp_max = (temp_max - 273.15) * 1.8 + 32;
        temp_feels_like = (temp_feels_like - 273.15) * 1.8 + 32;
        temp_text = '°F';
        break;
      // kelvin
      default:
        break;
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
        pressure: data.main.pressure,
        original_temp: data.main.temp,
        original_temp_min: data.main.temp_min,
        original_temp_max: data.main.temp_max,
        original_temp_feels_like: data.main.temp_feels_like,
      },
    });

    document.querySelector('.weather svg').style.fontSize = zoomWeather;
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
    const weatherType = localStorage.getItem('weatherType');
    const enabled = (setting) => {
      return (localStorage.getItem(setting) === 'true' && weatherType >= 3) || weatherType === '3';
    };

    if (this.state.location === variables.getMessage('weather.not_found')) {
      return (
        <div className="weather">
          <span className="loc">{this.state.location}</span>
        </div>
      );
    }

    const expandedInfo = () => {
      return (
        <div className="expanded-info">
          {weatherType >= 3 && (
            <span className="subtitle">
              {variables.getMessage('widgets.weather.extra_information')}
            </span>
          )}
          {enabled('cloudiness') ? (
            <Tooltip
              title={variables.getMessage(
                'modals.main.settings.sections.weather.extra_info.cloudiness',
              )}
              placement="left"
            >
              <span>
                <WiCloud className="weatherIcon" />
                {this.state.weather.cloudiness}%
              </span>
            </Tooltip>
          ) : null}
          {enabled('windspeed') ? (
            <Tooltip
              title={variables.getMessage(
                'modals.main.settings.sections.weather.extra_info.wind_speed',
              )}
              placement="left"
            >
              <span>
                <WiWindy className="weatherIcon" />
                {this.state.weather.wind_speed}
                <span className="minmax"> m/s</span>{' '}
                {enabled('windDirection') ? (
                  <div className="weatherIcon">
                    <WindDirectionIcon
                      className="weatherIcon"
                      degrees={this.state.weather.wind_degrees}
                    />
                  </div>
                ) : null}
              </span>
            </Tooltip>
          ) : null}
          {enabled('atmosphericpressure') ? (
            <Tooltip
              title={variables.getMessage(
                'modals.main.settings.sections.weather.extra_info.atmospheric_pressure',
              )}
              placement="left"
            >
              <span>
                <WiBarometer className="weatherIcon" />
                {this.state.weather.pressure}
                <span className="minmax"> hPa</span>
              </span>
            </Tooltip>
          ) : null}
          {enabled('weatherdescription') ? (
            <Tooltip
              title={variables.getMessage(
                'modals.main.settings.sections.weather.extra_info.show_description',
              )}
              placement="left"
            >
              <span>
                <div className="weatherIcon">
                  <WeatherIcon name={this.state.icon} />
                </div>
                {this.state.weather.description}
              </span>
            </Tooltip>
          ) : null}
          {enabled('visibility') ? (
            <Tooltip
              title={variables.getMessage(
                'modals.main.settings.sections.weather.extra_info.visibility',
              )}
              placement="left"
            >
              <span>
                <MdDisabledVisible style={{ padding: '3px' }} />
                {variables.getMessage('widgets.weather.meters', {
                  amount: this.state.weather.visibility,
                })}
              </span>
            </Tooltip>
          ) : null}
        </div>
      );
    };

    return (
      <div className="weather">
        <div>
          <div className="top-weather">
            {localStorage.getItem('weatherType') >= 1 && (
              <div>
                <WeatherIcon name={this.state.icon} />
                <span>{this.state.weather.temp + this.state.temp_text}</span>
              </div>
            )}
            {localStorage.getItem('weatherType') >= 2 && (
              <span className="minmax">
                <span className="subtitle">
                  {this.state.weather.temp_min + this.state.temp_text}
                </span>
                <span className="subtitle">
                  {this.state.weather.temp_max + this.state.temp_text}
                </span>
              </span>
            )}
          </div>
          {localStorage.getItem('weatherType') >= 2 && (
            <div className="extra-info">
              <span>
                {variables.getMessage('widgets.weather.feels_like', {
                  amount: this.state.weather.temp_feels_like + this.state.temp_text,
                })}
              </span>
              <span className="loc">{this.state.location}</span>
            </div>
          )}
        </div>
        {weatherType >= 3 ? expandedInfo() : null}
      </div>
    );
  }
}
