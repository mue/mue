import variables from 'modules/variables';
import { PureComponent } from 'react';

import Header from '../Header';
import Radio from '../Radio';
import Dropdown from '../Dropdown';
import Checkbox from '../Checkbox';
import { TextField } from '@mui/material';
import SettingsItem from '../SettingsItem';

export default class TimeSettings extends PureComponent {
  constructor() {
    super();
    this.state = {
      location: localStorage.getItem('location') || '',
      windSpeed: localStorage.getItem('windspeed') !== 'true',
    };
  }

  componentDidUpdate() {
    localStorage.setItem('location', this.state.location);
  }

  showReminder() {
    document.querySelector('.reminder-info').style.display = 'flex';
    localStorage.setItem('showReminder', true);
  }

  changeLocation(e) {
    this.setState({
      location: e.target.value,
    });

    this.showReminder();
  }

  getAuto() {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const data = await (
          await fetch(
            `${variables.constants.PROXY_URL}/weather/autolocation?lat=${position.coords.latitude}&lon=${position.coords.longitude}`,
          )
        ).json();
        this.setState({
          location: data[0].name,
        });

        this.showReminder();
      },
      (error) => {
        // firefox requires this 2nd function
        console.log(error);
      },
      {
        enableHighAccuracy: true,
      },
    );
  }

  render() {
    const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

    return (
      <>
        <Header
          title={getMessage('modals.main.settings.sections.weather.title')}
          setting="weatherEnabled"
          category="widgets"
          zoomSetting="zoomWeather"
          zoomCategory="weather"
          switch={true}
        />
        <SettingsItem title="Widget Type">
          <Dropdown label="Type" name="weatherType">
            <option value="1">Basic</option>
            <option value="2">Standard</option>
            <option value="3">Expanded</option>
            <option value="4">Custom</option>
          </Dropdown>
        </SettingsItem>
        <SettingsItem title={getMessage('modals.main.settings.sections.weather.location')}>
          <TextField
            label={getMessage('modals.main.settings.sections.weather.location')}
            value={this.state.location}
            onChange={(e) => this.changeLocation(e)}
            placeholder="London"
            varient="outlined"
            InputLabelProps={{ shrink: true }}
          />
          <span className="link" onClick={() => this.getAuto()}>
            {getMessage('modals.main.settings.sections.weather.auto')}
          </span>
        </SettingsItem>
        <SettingsItem title={getMessage('modals.main.settings.sections.weather.temp_format.title')}>
          <Radio
            name="tempformat"
            options={[
              {
                name:
                  getMessage('modals.main.settings.sections.weather.temp_format.celsius') + ' (°C)',
                value: 'celsius',
              },
              {
                name:
                  getMessage('modals.main.settings.sections.weather.temp_format.fahrenheit') +
                  ' (°F)',
                value: 'fahrenheit',
              },
              {
                name:
                  getMessage('modals.main.settings.sections.weather.temp_format.kelvin') + ' (K)',
                value: 'kelvin',
              },
            ]}
            category="weather"
          />
        </SettingsItem>
        {localStorage.getItem('weatherType') > 1 && (
          <SettingsItem title="Active bit" subtitle="idk a better word for it sorry">
            <Dropdown label="Type" name="weatherActiveBit" category="weather">
              <option value="weatherdescription">
                {getMessage('modals.main.settings.sections.weather.extra_info.show_description')}{' '}
              </option>
              <option value="cloudiness">
                {getMessage('modals.main.settings.sections.weather.extra_info.cloudiness')}
              </option>
              <option value="humidity">
                {getMessage('modals.main.settings.sections.weather.extra_info.humidity')}
              </option>
              <option value="visibility">
                {getMessage('modals.main.settings.sections.weather.extra_info.visibility')}
              </option>
              <option
                value="windspeed"
                onChange={() =>
                  this.setState({
                    windSpeed: localStorage.getItem('windspeed') !== 'true',
                  })
                }
              >
                {getMessage('modals.main.settings.sections.weather.extra_info.wind_speed')}
              </option>
              <option value="windDirection" disabled={this.state.windSpeed}>
                {getMessage('modals.main.settings.sections.weather.extra_info.wind_direction')}
              </option>
              <option value="mintemp">
                {getMessage('modals.main.settings.sections.weather.extra_info.min_temp')}
              </option>
              <option value="maxtemp">
                {getMessage('modals.main.settings.sections.weather.extra_info.max_temp')}
              </option>
              <option value="feelsliketemp">Feels like temperature</option>
              <option value="atmosphericpressure">
                {getMessage(
                  'modals.main.settings.sections.weather.extra_info.atmospheric_pressure',
                )}
              </option>
            </Dropdown>
          </SettingsItem>
        )}
        {localStorage.getItem('weatherType') == 4 && (
          <SettingsItem title="Custom Settings">
            <Checkbox
              name="showlocation"
              text={getMessage('modals.main.settings.sections.weather.extra_info.show_location')}
              category="weather"
            />
            <Checkbox
              name="weatherdescription"
              text={getMessage('modals.main.settings.sections.weather.extra_info.show_description')}
              category="weather"
            />
            <Checkbox
              name="cloudiness"
              text={getMessage('modals.main.settings.sections.weather.extra_info.cloudiness')}
              category="weather"
            />
            <Checkbox
              name="humidity"
              text={getMessage('modals.main.settings.sections.weather.extra_info.humidity')}
              category="weather"
            />
            <Checkbox
              name="visibility"
              text={getMessage('modals.main.settings.sections.weather.extra_info.visibility')}
              category="weather"
            />
            <Checkbox
              name="windspeed"
              text={getMessage('modals.main.settings.sections.weather.extra_info.wind_speed')}
              category="weather"
              onChange={() =>
                this.setState({
                  windSpeed: localStorage.getItem('windspeed') !== 'true',
                })
              }
            />
            <Checkbox
              name="windDirection"
              text={getMessage('modals.main.settings.sections.weather.extra_info.wind_direction')}
              category="weather"
              disabled={this.state.windSpeed}
            />
            <Checkbox
              name="mintemp"
              text={getMessage('modals.main.settings.sections.weather.extra_info.min_temp')}
              category="weather"
            />
            <Checkbox
              name="maxtemp"
              text={getMessage('modals.main.settings.sections.weather.extra_info.max_temp')}
              category="weather"
            />
            <Checkbox name="feelsliketemp" text={'Feels like temperature'} category="weather" />
            <Checkbox
              name="atmosphericpressure"
              text={getMessage(
                'modals.main.settings.sections.weather.extra_info.atmospheric_pressure',
              )}
              category="weather"
            />
            <Checkbox name="upcomingForecast" text="Upcoming Forecast" category="weather" />
          </SettingsItem>
        )}
      </>
    );
  }
}
