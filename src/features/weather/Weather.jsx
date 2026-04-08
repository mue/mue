import { useT } from 'contexts';
import { memo, useState, useEffect, useCallback } from 'react';
import { formatNumber } from 'utils/formatNumber';

import WeatherIcon from './components/WeatherIcon';
import Expanded from './components/Expanded';
import WeatherSkeleton from './components/WeatherSkeleton';

import EventBus from 'utils/eventbus';

import { getWeather } from './api/getWeather.js';

import './weather.scss';

const WeatherWidget = memo(() => {
  const t = useT();
  const [location, setLocation] = useState(() => {
    const stored = localStorage.getItem('location');
    if (!stored) return 'London';

    try {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    } catch {}
    return stored;
  });
  const [done, setDone] = useState(false);
  const [weatherData, setWeatherData] = useState({});

  const getLocationFromStorage = useCallback(() => {
    const stored = localStorage.getItem('location');
    if (!stored) return 'London';

    try {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    } catch {}
    return stored;
  }, []);

  const updateWeather = useCallback(async () => {
    const currentLocation = getLocationFromStorage();
    setLocation(currentLocation);

    const data = await getWeather(currentLocation);
    if (data) {
      setWeatherData(data);
      setDone(data.done);
    } else {
      setWeatherData({ done: true });
      setDone(true);
    }

    const zoomWeather = `${Number((localStorage.getItem('zoomWeather') || 100) / 100)}em`;
    const weatherElement = document.querySelector('.weather');
    if (weatherElement) {
      weatherElement.style.fontSize = zoomWeather;
    }
  }, [getLocationFromStorage]);

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

  const locationDisplay = (
    typeof location === 'object' ? location.displayName || location.name : location
  ).split(',')[0];

  if (!weatherData.weather) {
    return (
      <div className="weather">
        <span className="loc">{locationDisplay}</span>
      </div>
    );
  }

  return (
    <div className="weather">
      <div className="weatherCore">
        <div className="iconAndTemps">
          <div className="weathericon">
            <WeatherIcon name={weatherData.icon} />
            <span>{`${formatNumber(weatherData.weather.temp)}${weatherData.temp_text}`}</span>
          </div>
          {weatherType >= 2 && (
            <span className="minmax">
              <span className="subtitle">{`${formatNumber(weatherData.weather.temp_min)}${weatherData.temp_text}`}</span>
              <span className="subtitle">{`${formatNumber(weatherData.weather.temp_max)}${weatherData.temp_text}`}</span>
            </span>
          )}
        </div>
        {weatherType >= 2 && (
          <div className="extra-info">
            <span>
              {t('widgets.weather.feels_like', {
                amount: `${formatNumber(weatherData.weather.feels_like)}${weatherData.temp_text}`,
              })}
            </span>
            <span className="loc">{locationDisplay}</span>
          </div>
        )}
      </div>
      {weatherType >= 3 && <Expanded weatherType={weatherType} state={weatherData} />}
    </div>
  );
});

WeatherWidget.displayName = 'WeatherWidget';

export { WeatherWidget as default, WeatherWidget };
