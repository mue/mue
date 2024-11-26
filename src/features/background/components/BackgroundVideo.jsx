import React from 'react';
import defaults from '../options/default';

const BackgroundVideo = ({ url }) => {
  const enabled = (setting) => localStorage.getItem(setting) === 'true';
  return (
    <video
      autoPlay
      muted={enabled('backgroundVideoMute')}
      loop={enabled('backgroundVideoLoop')}
      style={{
        filter: `blur(${localStorage.getItem('blur')}px) brightness(${localStorage.getItem('brightness') || defaults.brightness}%)`,
      }}
      id="backgroundVideo"
    >
      <source src={url} />
    </video>
  );
};

export default BackgroundVideo;
