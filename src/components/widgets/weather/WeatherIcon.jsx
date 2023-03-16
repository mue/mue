import { memo } from 'react';
import PropTypes from 'prop-types';

import {
  WiDaySunny,
  WiNightClear,
  WiDayCloudy,
  WiNightCloudy,
  WiCloud,
  WiCloudy,
  WiDayShowers,
  WiNightShowers,
  WiRain,
  WiThunderstorm,
  WiSnow,
  WiFog,
} from 'react-icons/wi';

function WeatherIcon({ name }) {
  // name is the openweathermap icon name, see https://openweathermap.org/weather-conditions
  switch (name) {
    case '01d':
      return <WiDaySunny className="weatherIcon" />;
    case '01n':
      return <WiNightClear className="weatherIcon" />;
    case '02d':
      return <WiDayCloudy className="weatherIcon" />;
    case '02n':
      return <WiNightCloudy className="weatherIcon" />;
    case '03d':
    case '03n':
      return <WiCloud className="weatherIcon" />;
    case '04d':
    case '04n':
      return <WiCloudy className="weatherIcon" />;
    case '09d':
      return <WiDayShowers className="weatherIcon" />;
    case '09n':
      return <WiNightShowers className="weatherIcon" />;
    case '10d':
    case '10n':
      return <WiRain className="weatherIcon" />;
    case '11d':
    case '11n':
      return <WiThunderstorm className="weatherIcon" />;
    case '13d':
    case '13n':
      return <WiSnow className="weatherIcon" />;
    case '50d':
    case '50n':
      return <WiFog className="weatherIcon" />;
    default:
      return null;
  }
}

WeatherIcon.propTypes = {
  name: PropTypes.string.isRequired,
};

export default memo(WeatherIcon);
