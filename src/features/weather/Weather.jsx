import variables from 'config/variables';
import { memo, useState, useEffect, useCallback } from 'react';

import WeatherIcon from './components/WeatherIcon';
import Expanded from './components/Expanded';
import WeatherSkeleton from './components/WeatherSkeleton';

import EventBus from 'utils/eventbus';

import { getWeather } from './api/getWeather.js';

import './weather.scss';

const WeatherWidget = memo(() => {
  const [location, setLocation] = useState(localStorage.getItem('location') || 'London');
  const [done, setDone] = useState(false);
  const [weatherData, setWeatherData] = useState({});

  const updateWeather = useCallback(async () => {
    const data = await getWeather(location, done);
    setWeatherData(data);
    setDone(data.done);

    const zoomWeather = `${Number((localStorage.getItem('zoomWeather') || 100) / 100)}em`;
    const weatherElement = document.querySelector('.weather');
    if (weatherElement) {
      weatherElement.style.fontSize = zoomWeather;
    }
  }, [location, done]);

  useEffect(() => {
    const handleRefresh = async (data) => {
      if (data === 'weather') {
        await updateWeather();
      }
    };

    EventBus.on('refresh', handleRefresh);
    updateWeather();

    return () => {
      EventBus.off('refresh', handleRefresh);
    };
  }, [updateWeather]);

  const weatherType = localStorage.getItem('weatherType') || 1;

  if (done === false) {
    return <WeatherSkeleton weatherType={weatherType} />;
  }

  if (!weatherData.weather) {
    return (
      <div className="weather">
        <span className="loc">{location}</span>
      </div>
    );
  }

  return (
    <div className="weather">
      <div className="weatherCore">
        <div className="iconAndTemps">
          <div className="weathericon">
            <WeatherIcon name={weatherData.icon} />
            <span>{`${weatherData.weather.temp}${weatherData.temp_text}`}</span>
          </div>
          {weatherType >= 2 && (
            <span className="minmax">
              <span className="subtitle">{`${weatherData.weather.temp_min}${weatherData.temp_text}`}</span>
              <span className="subtitle">{`${weatherData.weather.temp_max}${weatherData.temp_text}`}</span>
            </span>
          )}
        </div>
        {weatherType >= 2 && (
          <div className="extra-info">
            <span>
              {variables.getMessage('widgets.weather.feels_like', {
                amount: `${weatherData.weather.feels_like}${weatherData.temp_text}`,
              })}
            </span>
            <span className="loc">{location}</span>
          </div>
        )}
      </div>
      {weatherType >= 3 && (
        <Expanded weatherType={weatherType} state={weatherData} variables={variables} />
      )}
    </div>
  );
});

WeatherWidget.displayName = 'WeatherWidget';

export { WeatherWidget as default, WeatherWidget };
