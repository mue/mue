/**
 * If the number is between 3 and 20, return the number with the suffix "th". Otherwise, return the
 * number with the suffix "st", "nd", "rd", or "th" depending on the last digit of the number
 * @param d - The day of the month.
 * @returns the day of the month with the appropriate suffix.
 */
export function nth(d) {
  if (d > 3 && d < 21) {
    return d + 'th';
  }

  switch (d % 10) {
    case 1:
      return d + 'st';
    case 2:
      return d + 'nd';
    case 3:
      return d + 'rd';
    default:
      return d + 'th';
  }
}

/**
 * It takes a date and a timezone and returns a new date object with the timezone applied.
 * @param date - The date you want to convert.
 * @param tz - The timezone you want to convert to.
 * @returns A new Date object with the timezone set to the timezone passed in.
 */
export function convertTimezone(date, tz) {
  return new Date(
    (typeof date === 'string' ? new Date(date) : date).toLocaleString('en-US', {
      timeZone: tz,
    }),
  );
}
