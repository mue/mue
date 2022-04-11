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

export default function WeatherIcon({ name }) {
  let icon;

  // name is the openweathermap icon name, see https://openweathermap.org/weather-conditions
  switch (name) {
    case '01d':
      icon = <WiDaySunny />;
      break;
    case '01n':
      icon = <WiNightClear />;
      break;
    case '02d':
      icon = <WiDayCloudy />;
      break;
    case '02n':
      icon = <WiNightCloudy />;
      break;
    case '03d':
    case '03n':
      icon = <WiCloud />;
      break;
    case '04d':
    case '04n':
      icon = <WiCloudy />;
      break;
    case '09d':
      icon = <WiDayShowers />;
      break;
    case '09n':
      icon = <WiNightShowers />;
      break;
    case '10d':
    case '10n':
      icon = <WiRain />;
      break;
    case '11d':
    case '11n':
      icon = <WiThunderstorm />;
      break;
    case '13d':
    case '13n':
      icon = <WiSnow />;
      break;
    case '50d':
    case '50n':
      icon = <WiFog />;
      break;
    default:
      icon = null;
      break;
  }

  return icon;
}
