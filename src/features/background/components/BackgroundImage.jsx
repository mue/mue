import { memo, useState, useEffect } from 'react';
import PhotoInformation from './PhotoInformation';
import variables from 'config/variables';
import { updateHash } from 'utils/deepLinking';
import EventBus from 'utils/eventbus';
import { getAllBackgrounds } from 'utils/customBackgroundDB';

/**
 * BackgroundImage component for rendering image backgrounds
 */
function BackgroundImage({ photoInfo, currentAPI, url }) {
  const isCustomType = localStorage.getItem('backgroundType') === 'custom';
  const [customBackgrounds, setCustomBackgrounds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCustomBackgrounds = async () => {
      if (isCustomType) {
        try {
          const backgrounds = await getAllBackgrounds();
          setCustomBackgrounds(backgrounds || []);
        } catch (error) {
          console.error('Failed to load custom backgrounds:', error);
          setCustomBackgrounds([]);
        }
      }
      setIsLoading(false);
    };

    loadCustomBackgrounds();
  }, [isCustomType]);

  const hasNoCustomImages =
    isCustomType && !isLoading && (!customBackgrounds || customBackgrounds.length === 0);

  const handleOpenSettings = () => {
    updateHash('#settings/background/source');
    EventBus.emit('modal', 'openMainModal');
  };

  return (
    <>
      <div id="backgroundImage" />
      {hasNoCustomImages && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            color: 'white',
            background: 'rgba(0, 0, 0, 0.6)',
            padding: '20px 30px',
            borderRadius: '10px',
            zIndex: 1,
          }}
        >
          <h2 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>
            {variables.getMessage('widgets.background.no_images_title') || 'No Custom Images'}
          </h2>
          <p style={{ margin: '0 0 15px 0', fontSize: '14px', opacity: 0.9 }}>
            {variables.getMessage('widgets.background.no_images_description') ||
              'Please add custom images in the Background settings'}
          </p>
          <button
            onClick={handleOpenSettings}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            {variables.getMessage('widgets.background.add_images_button') || 'Add Images'}
          </button>
        </div>
      )}
      {photoInfo?.credit && <PhotoInformation info={photoInfo} api={currentAPI} url={url} />}
    </>
  );
}

export default memo(BackgroundImage);
