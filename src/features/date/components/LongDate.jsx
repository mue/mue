import variables from 'config/variables';
import defaults from '../options/default';
import { appendNth } from 'utils/date';

export const LongDate = (currentDate) => {
  const lang = variables.locale_id.split('-')[0];

  const datenth =
    localStorage.getItem('datenth') === 'true'
      ? appendNth(currentDate.getDate())
      : currentDate.getDate();

  const dateDay =
    localStorage.getItem('dayofweek') === 'true'
      ? currentDate.toLocaleDateString(lang, { weekday: 'long' })
      : '';
  const dateMonth = currentDate.toLocaleDateString(lang, { month: 'long' });
  const dateYear = currentDate.getFullYear();

  let day = dateDay + ' ' + datenth;
  let month = dateMonth;
  let year = dateYear;

  switch (localStorage.getItem('longFormat')) {
    case 'MDY':
      day = dateMonth;
      month = dateDay + ' ' + datenth;
      break;
    case 'YMD':
      day = dateYear;
      year = dateDay + ' ' + datenth;
      break;
    // DMY
    default:
      break;
  }

  return `${day} ${month} ${year}`;
};
