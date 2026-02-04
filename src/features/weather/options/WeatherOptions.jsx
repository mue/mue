import { Header, Row, Content, Action, PreferencesWrapper } from 'components/Layout/Settings';
import { useLocalStorageState } from 'utils/useLocalStorageState';
import { Radio, Dropdown, Checkbox, LocationSearch } from 'components/Form/Settings';
import { useT } from 'contexts';

const useWeatherSettings = () => {
  const [windSpeed, setWindSpeed] = useLocalStorageState('windspeed', 'true');

  return {
    windSpeed: windSpeed !== 'true',
    setWindSpeed,
  };
};

const WeatherOptions = () => {
  const t = useT();
  const { windSpeed, setWindSpeed } = useWeatherSettings();
  const [weatherType, setWeatherType] = useLocalStorageState('weatherType', '1');
  const WEATHER_SECTION = 'modals.main.settings.sections.weather';

  const WidgetType = () => (
    <Row>
      <Content title={t(`${WEATHER_SECTION}.widget_type`)} />
      <Action>
        <Dropdown
          label={t('modals.main.settings.sections.time.type')}
          name="weatherType"
          category="weather"
          onChange={(value) => setWeatherType(value)}
          items={[
            { value: '1', text: t(`${WEATHER_SECTION}.options.basic`) },
            { value: '2', text: t(`${WEATHER_SECTION}.options.standard`) },
            { value: '3', text: t(`${WEATHER_SECTION}.options.expanded`) },
            { value: '4', text: t(`${WEATHER_SECTION}.options.custom`) },
          ]}
        />
      </Action>
    </Row>
  );

  const LocationSetting = () => (
    <Row>
      <Content title={t(`${WEATHER_SECTION}.location`)} />
      <Action>
        <LocationSearch
          label={t(`${WEATHER_SECTION}.location`)}
          name="location"
          category="weather"
          placeholder="London"
        />
      </Action>
    </Row>
  );

  const TemperatureFormat = () => (
    <Row final={weatherType !== '4'}>
      <Content title={t(`${WEATHER_SECTION}.temp_format.title`)} />
      <Action>
        <Radio
          name="tempformat"
          options={[
            {
              name: `${t(`${WEATHER_SECTION}.temp_format.celsius`)} (°C)`,
              value: 'celsius',
            },
            {
              name: `${t(`${WEATHER_SECTION}.temp_format.fahrenheit`)} (°F)`,
              value: 'fahrenheit',
            },
            {
              name: `${t(`${WEATHER_SECTION}.temp_format.kelvin`)} (K)`,
              value: 'kelvin',
            },
          ]}
          category="weather"
        />
      </Action>
    </Row>
  );

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
        onChange: () => setWindSpeed(localStorage.getItem('windspeed') !== 'true'),
      },
      {
        name: 'windDirection',
        textKey: `${WEATHER_SECTION}.extra_info.wind_direction`,
        disabled: windSpeed,
      },
      {
        name: 'atmosphericpressure',
        textKey: `${WEATHER_SECTION}.extra_info.atmospheric_pressure`,
      },
    ];

    return (
      <Row final={true}>
        <Content title={t(`${WEATHER_SECTION}.custom_settings`)} />
        <Action>
          {weatherOptions.map((item) => (
            <Checkbox
              key={item.name}
              name={item.name}
              text={t(item.textKey)}
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
        title={t(`${WEATHER_SECTION}.title`)}
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
        {WidgetType()}
        {/* https://stackoverflow.com/a/65328486 when using inputs it may defocus so we do the {} instead of <> */}
        {LocationSetting()}
        {TemperatureFormat()}
        {weatherType === '4' && CustomOptions()}
      </PreferencesWrapper>
    </>
  );
};

export { WeatherOptions as default, WeatherOptions };
