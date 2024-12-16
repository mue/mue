import defaults from '../options/default';

export const ShortDate = (currentDate) => {
  const dateDay = currentDate.getDate();
  const dateMonth = currentDate.getMonth() + 1;
  const dateYear = currentDate.getFullYear();

  const zero = localStorage.getItem('datezero') === 'true' || defaults.datezero;

  let day = zero ? ('00' + dateDay).slice(-2) : dateDay;
  let month = zero ? ('00' + dateMonth).slice(-2) : dateMonth;
  let year = dateYear;

  switch (localStorage.getItem('dateFormat')) {
    case 'MDY':
      day = dateMonth;
      month = dateDay;
      break;
    case 'YMD':
      day = dateYear;
      year = dateDay;
      break;
    // DMY
    default:
      break;
  }

  const separators = {
    dots: '.',
    dash: '-',
    gaps: ' - ',
    slashes: '/',
  };

  const format = separators[localStorage.getItem('shortFormat') || defaults.shortFormat];

  return <>{`${day}${format}${month}${format}${year}`}</>;
};
