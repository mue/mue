import variables from 'config/variables';

const convertTemperature = (temp, format) => {
  if (format === 'celsius') {
    return Math.round(temp - 273.15);
  } else if (format === 'fahrenheit') {
    return Math.round((temp - 273.15) * 1.8 + 32);
  }
  return Math.round(temp);
};

export const getWeather = async (location, done) => {
  if (done === true) {
    return;
  }

  let cached = localStorage.getItem('currentWeather');
  if (cached) {
    cached = JSON.parse(cached);
    // 300 seconds (in ms) = 5 minutes
    if (Date.now() - cached.cachedAt < 3e5) {
      return cached.data;
    }
  }

  try {
    const response = await fetch(
      variables.constants.API_URL + `/weather?city=${location}&language=${variables.locale_id}`,
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
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

    const tempSymbols = {
      celsius: '°C',
      kelvin: 'K',
      fahrenheit: '°F',
    };

    const cacheable = {
      icon: data.weather[0].icon,
      temp_text: tempSymbols[tempFormat] || 'K',
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
  }
};
