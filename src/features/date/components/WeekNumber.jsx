import variables from 'config/variables';
import defaults from '../options/default';

const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

export const WeekNumber = (date) => {
  const enabled = localStorage.getItem('weeknumber') === 'true' || defaults.weeknumber;

  if (!enabled || !date) {
    return null;
  }

  const weekNumber = getWeekNumber(date);

  return (
    <span className="date">
      {variables.getMessage('widgets.date.week')} {weekNumber}
    </span>
  );
};
