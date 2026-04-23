import variables from 'config/variables';

const convertTemperature = (temp, format) => {
  if (format === 'celsius') {
    return Math.round(temp - 273.15);
  } else if (format === 'fahrenheit') {
    return Math.round((temp - 273.15) * 1.8 + 32);
  }
  return Math.round(temp);
};

const getLocalizedTempSymbol = (format) => {
  const language = localStorage.getItem('language') || 'en_GB';
  const baseLang = language.split('_')[0];

  const localizedSymbols = {
    ar: {
      celsius: '°س',
      fahrenheit: '°ف',
      kelvin: 'ك',
    },
    fa: {
      celsius: '°س',
      fahrenheit: '°ف',
      kelvin: 'ک',
    },
  };

  const defaultSymbols = {
    celsius: '°C',
    fahrenheit: '°F',
    kelvin: 'K',
  };

  return localizedSymbols[baseLang]?.[format] || defaultSymbols[format] || 'K';
};

export const getWeather = async (location) => {
  let cached = localStorage.getItem('currentWeather');
  if (cached) {
    cached = JSON.parse(cached);
    // 300 seconds (in ms) = 5 minutes
    if (Date.now() - cached.cachedAt < 3e5) {
      return cached.data;
    }
  }

  try {
    let url;
    if (typeof location === 'object' && location.lat && location.lon) {
      url = `${variables.constants.API_URL}/weather?lat=${location.lat}&lon=${location.lon}`;
    } else {
      const cityName =
        typeof location === 'object' ? location.displayName || location.name : location;
      url = `${variables.constants.API_URL}/weather?city=${encodeURIComponent(cityName)}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      console.error('Weather API response not ok:', response.status, response.statusText);
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 404) {
      return {
        location: variables.getMessage('widgets.weather.not_found'),
        done: true,
      };
    }

    const { temp, temp_min, temp_max, feels_like } = data.main;
    const tempFormat = localStorage.getItem('tempformat');

    const cacheable = {
      icon: data.weather[0].icon,
      temp_text: getLocalizedTempSymbol(tempFormat),
      weather: {
        temp: convertTemperature(temp, tempFormat),
        description: data.weather[0].description,
        temp_min: convertTemperature(temp_min, tempFormat),
        temp_max: convertTemperature(temp_max, tempFormat),
        feels_like: convertTemperature(feels_like, tempFormat),
        humidity: data.main.humidity,
        wind_speed: data.wind.speed,
        wind_degrees: data.wind.deg,
        cloudiness: data.clouds.all,
        visibility: data.visibility,
        pressure: data.main.pressure,
      },
      done: true,
    };
    localStorage.setItem(
      'currentWeather',
      JSON.stringify({ data: cacheable, cachedAt: Date.now() }),
    );
    return cacheable;
  } catch (error) {
    console.error('Fetch Error: ', error);
    return {
      location: variables.getMessage('widgets.weather.fetch_error'),
      done: true,
    };
  }
};
