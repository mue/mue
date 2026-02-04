// todo: maybe move stuff
/**
 * Returns the number with an ordinal suffix for English locales (st, nd, rd, th).
 * For non-English locales, returns the plain number since ordinal conventions vary by language.
 * @param d - The day of the month or any number.
 * @param lang - Optional language code (e.g., 'en', 'tr'). If starts with 'en', applies English ordinals.
 * @returns The number, optionally with an English ordinal suffix.
 */
export function nth(d, lang) {
  if (lang && !lang.startsWith('en')) {
    return d;
  }

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
