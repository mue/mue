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
    return (
      <>
        <Header
          title={variables.getMessage('modals.main.settings.sections.weather.title')}
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
        <SettingsItem
          title={variables.getMessage('modals.main.settings.sections.weather.location')}
        >
          <TextField
            label={variables.getMessage('modals.main.settings.sections.weather.location')}
            value={this.state.location}
            onChange={(e) => this.changeLocation(e)}
            placeholder="London"
            varient="outlined"
            InputLabelProps={{ shrink: true }}
          />
          <span className="link" onClick={() => this.getAuto()}>
            {variables.getMessage('modals.main.settings.sections.weather.auto')}
          </span>
        </SettingsItem>
        <SettingsItem
          title={variables.getMessage('modals.main.settings.sections.weather.temp_format.title')}
        >
          <Radio
            name="tempformat"
            options={[
              {
                name:
                  variables.getMessage(
                    'modals.main.settings.sections.weather.temp_format.celsius',
                  ) + ' (°C)',
                value: 'celsius',
              },
              {
                name:
                  variables.getMessage(
                    'modals.main.settings.sections.weather.temp_format.fahrenheit',
                  ) + ' (°F)',
                value: 'fahrenheit',
              },
              {
                name:
                  variables.getMessage('modals.main.settings.sections.weather.temp_format.kelvin') +
                  ' (K)',
                value: 'kelvin',
              },
            ]}
            category="weather"
          />
        </SettingsItem>
        {localStorage.getItem('weatherType') == 4 && (
          <SettingsItem title="Custom Settings">
            <Checkbox
              name="showlocation"
              text={variables.getMessage(
                'modals.main.settings.sections.weather.extra_info.show_location',
              )}
              category="weather"
            />
            <Checkbox
              name="weatherdescription"
              text={variables.getMessage(
                'modals.main.settings.sections.weather.extra_info.show_description',
              )}
              category="weather"
            />
            <Checkbox
              name="cloudiness"
              text={variables.getMessage(
                'modals.main.settings.sections.weather.extra_info.cloudiness',
              )}
              category="weather"
            />
            <Checkbox
              name="humidity"
              text={variables.getMessage(
                'modals.main.settings.sections.weather.extra_info.humidity',
              )}
              category="weather"
            />
            <Checkbox
              name="visibility"
              text={variables.getMessage(
                'modals.main.settings.sections.weather.extra_info.visibility',
              )}
              category="weather"
            />
            <Checkbox
              name="windspeed"
              text={variables.getMessage(
                'modals.main.settings.sections.weather.extra_info.wind_speed',
              )}
              category="weather"
              onChange={() =>
                this.setState({
                  windSpeed: localStorage.getItem('windspeed') !== 'true',
                })
              }
            />
            <Checkbox
              name="windDirection"
              text={variables.getMessage(
                'modals.main.settings.sections.weather.extra_info.wind_direction',
              )}
              category="weather"
              disabled={this.state.windSpeed}
            />
            <Checkbox
              name="mintemp"
              text={variables.getMessage(
                'modals.main.settings.sections.weather.extra_info.min_temp',
              )}
              category="weather"
            />
            <Checkbox
              name="maxtemp"
              text={variables.getMessage(
                'modals.main.settings.sections.weather.extra_info.max_temp',
              )}
              category="weather"
            />
            <Checkbox name="feelsliketemp" text={'Feels like temperature'} category="weather" />
            <Checkbox
              name="atmosphericpressure"
              text={variables.getMessage(
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
