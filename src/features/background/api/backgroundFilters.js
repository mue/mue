/**
 * Generates the filter style string for backgrounds
 * @returns {string} The filter CSS string
 */
export function getBackgroundFilterStyle() {
  const blur = localStorage.getItem('blur') || '0';
  const brightness = localStorage.getItem('brightness') || '100';
  const backgroundFilter = localStorage.getItem('backgroundFilter');
  const backgroundFilterAmount = localStorage.getItem('backgroundFilterAmount') || '100';

  let filterString = `blur(${blur}px) brightness(${brightness}%)`;

  if (backgroundFilter && backgroundFilter !== 'none') {
    filterString += ` ${backgroundFilter}(${backgroundFilterAmount}%)`;
  }

  return filterString;
}
