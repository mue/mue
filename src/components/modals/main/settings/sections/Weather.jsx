import variables from 'modules/variables';
import { PureComponent } from 'react';

import { MdAutoAwesome } from 'react-icons/md';

import Header from '../Header';
import Radio from '../Radio';
import Dropdown from '../Dropdown';
import Checkbox from '../Checkbox';
import { TextField } from '@mui/material';

import PreferencesWrapper from '../PreferencesWrapper';

import { Row, Content, Action } from '../SettingsItem';

export default class WeatherSettings extends PureComponent {
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

  render() {
    const weatherType = localStorage.getItem('weatherType');

    const WEATHER_SECTION = 'modals.main.settings.sections.weather';

    const WidgetType = () => {
      return (
        <Row>
          <Content title={variables.getMessage(`${WEATHER_SECTION}.widget_type`)} />
          <Action>
            <Dropdown
              label={variables.getMessage('modals.main.settings.sections.time.type')}
              name="weatherType"
              category="weather"
              onChange={() => this.forceUpdate()}
            >
              <option value="1">{variables.getMessage(`${WEATHER_SECTION}.options.basic`)}</option>
              <option value="2">
                {variables.getMessage(`${WEATHER_SECTION}.options.standard`)}
              </option>
              <option value="3">
                {variables.getMessage(`${WEATHER_SECTION}.options.expanded`)}
              </option>
              <option value="4">{variables.getMessage(`${WEATHER_SECTION}.options.custom`)}</option>
            </Dropdown>
          </Action>
        </Row>
      );
    };

    const LocationSetting = () => {
      const getAuto = () => {
        this.setState({
          location: variables.getMessage('modals.main.loading'),
        });

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const data = await (
              await fetch(
                `${variables.constants.API_URL}/gps?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`,
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
      };
      return (
        <Row>
          <Content title={variables.getMessage(`${WEATHER_SECTION}.location`)} />
          <Action>
            <TextField
              label={variables.getMessage(`${WEATHER_SECTION}.location`)}
              value={this.state.location}
              onChange={(e) => this.changeLocation(e)}
              placeholder="London"
              varient="outlined"
              InputLabelProps={{ shrink: true }}
            />
            <span className="link" onClick={getAuto}>
              <MdAutoAwesome />
              {variables.getMessage(`${WEATHER_SECTION}.auto`)}
            </span>
          </Action>
        </Row>
      );
    };

    const TemperatureFormat = () => {
      return (
        <Row final={weatherType !== '4'}>
          <Content title={variables.getMessage(`${WEATHER_SECTION}.temp_format.title`)} />
          <Action>
            <Radio
              name="tempformat"
              options={[
                {
                  name: variables.getMessage(`${WEATHER_SECTION}.temp_format.celsius`) + ' (°C)',
                  value: 'celsius',
                },
                {
                  name: variables.getMessage(`${WEATHER_SECTION}.temp_format.fahrenheit`) + ' (°F)',
                  value: 'fahrenheit',
                },
                {
                  name: variables.getMessage(`${WEATHER_SECTION}.temp_format.kelvin`) + ' (K)',
                  value: 'kelvin',
                },
              ]}
              category="weather"
            />
          </Action>
        </Row>
      );
    };

    const CustomOptions = () => {
      const weatherOptions = [
        {
          name: 'weatherdescription',
          textKey: `${WEATHER_SECTION}.extra_info.show_description`,
        },
        {
          name: 'cloudiness',
          textKey: `${WEATHER_SECTION}.extra_info.cloudiness`,
        },
        { name: 'humidity', textKey: `${WEATHER_SECTION}.extra_info.humidity` },
        {
          name: 'visibility',
          textKey: `${WEATHER_SECTION}.extra_info.visibility`,
        },
        {
          name: 'windspeed',
          textKey: `${WEATHER_SECTION}.extra_info.wind_speed`,
          onChange: () =>
            this.setState({ windSpeed: localStorage.getItem('windspeed') !== 'true' }),
        },
        {
          name: 'windDirection',
          textKey: `${WEATHER_SECTION}.extra_info.wind_direction`,
          disabled: this.state.windSpeed,
        },
        {
          name: 'atmosphericpressure',
          textKey: `${WEATHER_SECTION}.extra_info.atmospheric_pressure`,
        },
      ];

      return (
        <Row final={true}>
          <Content title={variables.getMessage(`${WEATHER_SECTION}.custom_settings`)} />
          <Action>
            {weatherOptions.map((item) => (
              <Checkbox
                key={item.name}
                name={item.name}
                text={variables.getMessage(item.textKey)}
                category="weather"
                onChange={item.onChange}
                disabled={item.disabled}
              />
            ))}
          </Action>
        </Row>
      );
    };

    return (
      <>
        <Header
          title={variables.getMessage(`${WEATHER_SECTION}.title`)}
          setting="weatherEnabled"
          category="widgets"
          zoomSetting="zoomWeather"
          zoomCategory="weather"
          visibilityToggle={true}
        />
        <PreferencesWrapper
          setting="weatherEnabled"
          zoomSetting="zoomWeather"
          zoomCategory="weather"
          visibilityToggle={true}
        >
          <WidgetType />
          {/* https://stackoverflow.com/a/65328486 when using inputs it may defocus so we do the {} instead of <> */}
          {LocationSetting()}
          <TemperatureFormat />
          {weatherType === '4' && <CustomOptions />}
        </PreferencesWrapper>
      </>
    );
  }
}
