/**
 * If the number is between 3 and 20, return the number with the suffix "th". Otherwise, return the
 * number with the suffix "st", "nd", "rd", or "th" depending on the last digit of the number
 * @param d - The day of the month.
 * @returns the day of the month with the appropriate suffix.
 */
export function appendNth(d) {
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
