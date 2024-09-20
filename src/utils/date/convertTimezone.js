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
