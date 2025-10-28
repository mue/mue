import { memo } from 'react';

/**
 * BackgroundVideo component for rendering video backgrounds
 */
function BackgroundVideo({ url, filterStyle }) {
  const isMuted = localStorage.getItem('backgroundVideoMute') === 'true';
  const shouldLoop = localStorage.getItem('backgroundVideoLoop') === 'true';

  return (
    <video
      autoPlay
      muted={isMuted}
      loop={shouldLoop}
      style={filterStyle}
      id="backgroundVideo"
    >
      <source src={url} />
    </video>
  );
}

export default memo(BackgroundVideo);
