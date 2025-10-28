import { memo } from 'react';
import PhotoInformation from './PhotoInformation';

/**
 * BackgroundImage component for rendering image backgrounds
 */
function BackgroundImage({ filterStyle, photoInfo, currentAPI, url }) {
  return (
    <>
      <div style={filterStyle} id="backgroundImage" />
      {photoInfo?.credit && (
        <PhotoInformation info={photoInfo} api={currentAPI} url={url} />
      )}
    </>
  );
}

export default memo(BackgroundImage);
