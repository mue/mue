import React from 'react';
import defaults from '../options/default';

const BackgroundImage = () => {
  const backgroundFilter = localStorage.getItem('backgroundFilter') || defaults.backgroundFilter;
  return (
    <div
      style={{
        filter: `blur(${localStorage.getItem('blur') || defaults.blur}px) brightness(${localStorage.getItem('brightness') || defaults.brightness}%) ${
          backgroundFilter && backgroundFilter !== 'none'
            ? backgroundFilter +
              '(' +
              (localStorage.getItem('backgroundFilterAmount') || defaults.backgroundFilterAmount) +
              '%)'
            : ''
        }`,
      }}
      id="backgroundImage"
      className="backgroundImage"
    >
      <div id="blurhashOverlay" className="blurhashOverlay" />
      <img id="backgroundImageActual" className="backgroundImageActual" alt="background" />
    </div>
  );
};

export default BackgroundImage;
