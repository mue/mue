import { memo, useMemo } from 'react';

import { WiHumidity, WiWindy, WiBarometer, WiCloud } from 'react-icons/wi';
import { MdDisabledVisible } from 'react-icons/md';

import WeatherIcon from './WeatherIcon';
import WindDirectionIcon from './WindDirectionIcon';

import { Tooltip } from 'components/Elements';

const weatherTypes = {
  cloudiness: {
    icon: WiCloud,
    key: 'cloudiness',
    unit: '%',
    title: 'modals.main.settings.sections.weather.extra_info.cloudiness',
  },
  windspeed: {
    icon: WiWindy,
    key: 'wind_speed',
    unit: 'm/s',
    title: 'modals.main.settings.sections.weather.extra_info.wind_speed',
    extra: 'windDirection',
  },
  atmosphericpressure: {
    icon: WiBarometer,
    key: 'pressure',
    unit: 'hPa',
    title: 'modals.main.settings.sections.weather.extra_info.atmospheric_pressure',
  },
  weatherdescription: {
    icon: WeatherIcon,
    key: 'description',
    title: 'modals.main.settings.sections.weather.extra_info.weather_description',
  },
  visibility: {
    icon: MdDisabledVisible,
    key: 'visibility',
    unit: 'm',
    title: 'modals.main.settings.sections.weather.extra_info.visibility',
  },
  humidity: {
    icon: WiHumidity,
    key: 'humidity',
    unit: '%',
    title: 'modals.main.settings.sections.weather.extra_info.humidity',
  },
};

function Expanded({ state: { weather, icon }, weatherType, variables }) {
  const enabled = useMemo(() => {
    return (setting) => {
      return (localStorage.getItem(setting) === 'true' && weatherType >= 3) || weatherType === '3';
    };
  }, [weatherType]);

  const WeatherTooltip = ({ type }) => {
    const { icon: Icon, key, unit, title, extra } = weatherTypes[type];
    return (
      enabled(type) && (
        <Tooltip title={variables.getMessage(title)} placement="left">
          <span>
            <Icon className="weatherIcon" name={icon} />
            {`${weather[key]} ${unit || ''}`}
            {extra && (
              <div style={{ fontSize: '25px', display: 'grid' }}>
                <WindDirectionIcon className="weatherIcon" degrees={weather.wind_degrees} />
              </div>
            )}
          </span>
        </Tooltip>
      )
    );
  };

  const anyTooltipEnabled = Object.keys(weatherTypes).some(enabled);

  return (
    anyTooltipEnabled && (
      <div className="expanded-info">
        {weatherType >= 3 && (
          <span className="subtitle">
            {variables.getMessage('widgets.weather.extra_information')}
          </span>
        )}
        {Object.keys(weatherTypes).map((type) => (
          <WeatherTooltip key={type} type={type} />
        ))}
      </div>
    )
  );
}

export default memo(Expanded);
