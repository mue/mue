import { memo } from 'react';
import PhotoInformation from './PhotoInformation';

/**
 * BackgroundImage component for rendering image backgrounds
 */
function BackgroundImage({ photoInfo, currentAPI, url }) {
  return (
    <>
      <div id="backgroundImage" />
      {photoInfo?.credit && (
        <PhotoInformation info={photoInfo} api={currentAPI} url={url} />
      )}
    </>
  );
}

export default memo(BackgroundImage);
