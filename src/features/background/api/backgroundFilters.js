/**
 * Generates the filter style string for backgrounds (legacy)
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

/**
 * Generates styles for the background filter overlay
 * Uses backdrop-filter for blur and additional effects, and background-color for brightness
 * @returns {Object} Style object with backdropFilter and backgroundColor
 */
export function getBackgroundOverlayStyle() {
  const blur = localStorage.getItem('blur') || '0';
  const brightness = localStorage.getItem('brightness') || '100';
  const backgroundFilter = localStorage.getItem('backgroundFilter');
  const backgroundFilterAmount = localStorage.getItem('backgroundFilterAmount') || '100';

  // Build backdrop-filter string for blur and other effects
  let backdropFilterString = `blur(${blur}px)`;

  if (backgroundFilter && backgroundFilter !== 'none') {
    backdropFilterString += ` ${backgroundFilter}(${backgroundFilterAmount}%)`;
  }

  // Calculate brightness overlay (black overlay for darkening)
  // brightness 100% = no overlay (opacity 0)
  // brightness 0% = full black overlay (opacity 1)
  const brightnessValue = parseInt(brightness, 10);
  const overlayOpacity = (100 - brightnessValue) / 100;

  return {
    backdropFilter: backdropFilterString,
    WebkitBackdropFilter: backdropFilterString, // Safari support
    backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
  };
}
