import { memo, useMemo } from 'react';

import { WiHumidity, WiWindy, WiBarometer, WiCloud } from 'react-icons/wi';
import { MdDisabledVisible } from 'react-icons/md';

import WeatherIcon from './components/WeatherIcon';
import WindDirectionIcon from './WindDirectionIcon';

import { Tooltip } from 'components/Elements';
function Expanded({ state: { weather, icon }, weatherType, variables }) {
  /**
   * If the localStorage item is true and the weatherType is greater than or equal to 3, or if the
   * weatherType is equal to 3, then return true.
   * @param {string} setting - The localStorage item to check.
   * @returns a boolean value.
   */
  const enabled = useMemo(() => {
    return (setting) => {
      return (localStorage.getItem(setting) === 'true' && weatherType >= 3) || weatherType === '3';
    };
  }, [weatherType]);

  return (
    <div className="expanded-info">
      {weatherType >= 3 && (
        <span className="subtitle">
          {variables.getMessage('widgets.weather.extra_information')}
        </span>
      )}
      {enabled('cloudiness') && (
        <Tooltip
          title={variables.getMessage(
            'modals.main.settings.sections.weather.extra_info.cloudiness',
          )}
          placement="left"
        >
          <span>
            <WiCloud className="weatherIcon" />
            {weather.cloudiness}%
          </span>
        </Tooltip>
      )}
      {enabled('windspeed') && (
        <Tooltip
          title={variables.getMessage(
            'modals.main.settings.sections.weather.extra_info.wind_speed',
          )}
          placement="left"
        >
          <span>
            <WiWindy className="weatherIcon" />
            {weather.wind_speed}
            <span className="minmax">m/s</span>{' '}
            {enabled('windDirection') && (
              <div style={{ fontSize: '25px', display: 'grid' }}>
                <WindDirectionIcon className="weatherIcon" degrees={weather.wind_degrees} />
              </div>
            )}
          </span>
        </Tooltip>
      )}
      {enabled('atmosphericpressure') && (
        <Tooltip
          title={variables.getMessage(
            'modals.main.settings.sections.weather.extra_info.atmospheric_pressure',
          )}
          placement="left"
        >
          <span>
            <WiBarometer className="weatherIcon" />
            {weather.pressure}
            <span className="minmax">hPa</span>
          </span>
        </Tooltip>
      )}
      {enabled('weatherdescription') && (
        <Tooltip
          title={variables.getMessage(
            'modals.main.settings.sections.weather.extra_info.weather_description',
          )}
          placement="left"
        >
          <span>
            <WeatherIcon className="weatherIcon" name={icon} />
            {weather.description}
          </span>
        </Tooltip>
      )}
      {enabled('visibility') && (
        <Tooltip
          title={variables.getMessage(
            'modals.main.settings.sections.weather.extra_info.visibility',
          )}
          placement="left"
        >
          <span>
            <MdDisabledVisible className="materialWeatherIcon" />
            {variables.getMessage('widgets.weather.meters', {
              amount: weather.visibility,
            })}
          </span>
        </Tooltip>
      )}
      {enabled('humidity') && (
        <Tooltip
          title={variables.getMessage('modals.main.settings.sections.weather.extra_info.humidity')}
          placement="left"
        >
          <span>
            <WiHumidity className="materialWeatherIcon" />
            {weather.humidity}
          </span>
        </Tooltip>
      )}
    </div>
  );
}

export default memo(Expanded);
