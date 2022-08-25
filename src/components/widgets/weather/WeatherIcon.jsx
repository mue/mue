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
  // name is the openweathermap icon name, see https://openweathermap.org/weather-conditions
  switch (name) {
    case '01d':
      return <WiDaySunny />;
    case '01n':
      return <WiNightClear />;
    case '02d':
      return <WiDayCloudy />;
    case '02n':
      return <WiNightCloudy />;
    case '03d':
    case '03n':
      return <WiCloud />;
    case '04d':
    case '04n':
      return <WiCloudy />;
    case '09d':
      return <WiDayShowers />;
    case '09n':
      return <WiNightShowers />;
    case '10d':
    case '10n':
      return <WiRain />;
    case '11d':
    case '11n':
      return <WiThunderstorm />;
    case '13d':
    case '13n':
      return <WiSnow />;
    case '50d':
    case '50n':
      return <WiFog />;
    default:
      return null;
  }
}
