import { useState, useEffect, useCallback } from 'react';
import variables from 'config/variables';

import WeatherIcon from './components/WeatherIcon';
import Expanded from './components/Expanded';
import WeatherSkeleton from './components/WeatherSkeleton';

import EventBus from 'utils/eventbus';
import { getWeather } from './api/getWeather.js';
import defaults from './options/default';

import './weather.scss';

const WeatherWidget = () => {
  const [location, setLocation] = useState(localStorage.getItem('location') || defaults.location);
  const [done, setDone] = useState(false);
  const [weatherData, setWeatherData] = useState(null);

  const fetchWeatherData = useCallback(async () => {
    const data = await getWeather(location, done);
    if (data) {
      setWeatherData(data);
      setDone(data.done || false);

      const zoomWeather = `${Number((localStorage.getItem('zoomWeather') || defaults.zoomWeather) / 100)}em`;
      const weatherElement = document.querySelector('.weather');
      if (weatherElement) {
        weatherElement.style.fontSize = zoomWeather;
      }
    }
  }, [location, done]);

  useEffect(() => {
    const refreshListener = async (data) => {
      if (data === 'weather') {
        await fetchWeatherData();
      }
    };

    EventBus.on('refresh', refreshListener);
    fetchWeatherData();

    return () => {
      EventBus.off('refresh', refreshListener);
    };
  }, [fetchWeatherData]);

  const weatherType = localStorage.getItem('weatherType') || defaults.weatherType;

  if (!done) {
    return <WeatherSkeleton weatherType={weatherType} />;
  }

  if (!weatherData) {
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
};

export { WeatherWidget as default, WeatherWidget };
