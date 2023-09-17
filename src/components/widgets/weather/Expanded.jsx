import { memo } from 'react';
import PropTypes from 'prop-types';

import { WiHumidity, WiWindy, WiBarometer, WiCloud } from 'react-icons/wi';
import { MdDisabledVisible } from 'react-icons/md';

import WeatherIcon from './WeatherIcon';
import WindDirectionIcon from './WindDirectionIcon';

import Tooltip from 'components/helpers/tooltip/Tooltip';

function Expanded({ state, weatherType, variables }) {
  /**
   * If the localStorage item is true and the weatherType is greater than or equal to 3, or if the
   * weatherType is equal to 3, then return true.
   * @param {string} setting - The localStorage item to check.
   * @returns a boolean value.
   */
  const enabled = (setting) => {
    return (localStorage.getItem(setting) === 'true' && weatherType >= 3) || weatherType === '3';
  };

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
            {state.weather.cloudiness}%
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
            {state.weather.wind_speed}
            <span className="minmax">m/s</span>{' '}
            {enabled('windDirection') ? (
              <div style={{ fontSize: '25px', display: 'grid' }}>
                <WindDirectionIcon className="weatherIcon" degrees={state.weather.wind_degrees} />
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
            {state.weather.pressure}
            <span className="minmax">hPa</span>
          </span>
        </Tooltip>
      ) : null}
      {enabled('weatherdescription') ? (
        <Tooltip
          title={variables.getMessage(
            'modals.main.settings.sections.weather.extra_info.weather_description',
          )}
          placement="left"
        >
          <span>
            <WeatherIcon className="weatherIcon" name={state.icon} />
            {state.weather.description}
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
            <MdDisabledVisible className="materialWeatherIcon" />
            {variables.getMessage('widgets.weather.meters', {
              amount: state.weather.visibility,
            })}
          </span>
        </Tooltip>
      ) : null}
      {enabled('humidity') ? (
        <Tooltip
          title={variables.getMessage('modals.main.settings.sections.weather.extra_info.humidity')}
          placement="left"
        >
          <span>
            <WiHumidity className="materialWeatherIcon" />
            {state.weather.humidity}
          </span>
        </Tooltip>
      ) : null}
    </div>
  );
}

Expanded.propTypes = {
  state: PropTypes.object.isRequired,
  weatherType: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  variables: PropTypes.object.isRequired,
};

export default memo(Expanded);
