import variables from 'config/variables';
import { useState, memo } from 'react';
import { useT } from 'contexts';
import { useNavigate } from 'react-router';
import Favourite from './Favourite';
import {
  MdInfo,
  MdLocationOn,
  MdPhotoCamera,
  MdCrop as Resolution,
  MdGetApp as Download,
  MdVisibility as Views,
  MdIosShare as Share,
  MdSource as Source,
  MdFavorite as MdFavourite,
  MdCategory as Category,
  MdVisibilityOff as VisibilityOff,
  MdColorLens,
} from 'react-icons/md';
import { HiMiniArrowUpRight } from 'react-icons/hi2';
import { Tooltip } from 'components/Elements';
import { getProxiedImageUrl } from 'utils/marketplace';
import { getAttributionConfig, addUTMParams } from '../utils/attributionHelper';

import Modal from 'react-modal';
import { ShareModal } from 'components/Elements';
import ExcludeModal from './ExcludeModal';

/**
 * It takes a URL, fetches the resource, and returns a URL to the resource.
 * @param {string} url The URL to fetch.
 * @returns A promise that resolves to a blob URL.
 */
const toDataURL = async (url) => {
  const res = await fetch(url);
  return URL.createObjectURL(await res.blob());
};

/**
 * It takes a string, makes it lowercase, removes commas, and replaces spaces with dashes.
 * @param {string} text The string to format.
 * @returns A function that takes a string and returns a string.
 */
const formatText = (text) => {
  return text.toLowerCase().replaceAll(',', '').replaceAll(' ', '-');
};

/**
 * It downloads an image from a URL and saves it to the user's computer.
 * @param {object} info The photo information.
 */
const downloadImage = async (info) => {
  const link = document.createElement('a');
  link.href = await toDataURL(getProxiedImageUrl(info.url));
  const locationText =
    typeof info.location === 'string' ? info.location : info.location?.name || 'unknown';
  link.download = `mue-${formatText(info.credit)}-${formatText(locationText)}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  variables.stats.postEvent('feature', 'Background download');
};

/**
 * MetadataItem - Displays a single metadata field with icon and label
 */
function MetadataItem({ icon, label, value }) {
  return (
    <div className="metadata-item" title={label}>
      {icon}
      <div className="metadata-content">
        <span className="metadata-label">{label}</span>
        <span className="metadata-value">{value}</span>
      </div>
    </div>
  );
}

/**
 * ColorSwatch - Displays a color preview with hex code
 */
function ColorSwatch({ hex }) {
  if (!hex) return null;

  return (
    <div className="color-swatch">
      <div
        className="swatch-preview"
        style={{ backgroundColor: hex }}
        aria-label={`Color: ${hex}`}
      />
      <span className="swatch-hex">{hex}</span>
    </div>
  );
}

/**
 * MetadataGrid - 2-column grid of photo metadata
 */
function MetadataGrid({
  location,
  camera,
  width,
  height,
  colour,
  category,
  packId,
  packName,
  onPackClick,
}) {
  const t = useT();

  // Get pack display name from marketplace data
  const getPackDisplayName = () => {
    if (packName) return packName;
    if (!packId) return null;

    // Try to get pack name from installed marketplace items
    try {
      const installedItems = JSON.parse(localStorage.getItem('installed') || '[]');
      const packItem = installedItems.find((item) => item.id === packId);

      if (packItem) {
        return packItem.display_name || packItem.name;
      }
    } catch (e) {
      console.error('Error looking up pack name:', e);
    }

    // Fallback: format pack ID (remove underscores, capitalize)
    return packId
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const packDisplayName = getPackDisplayName();

  return (
    <div className="metadata-grid">
      {location && location !== 'N/A' && (
        <MetadataItem
          icon={<MdLocationOn />}
          label={t('widgets.background.location')}
          value={typeof location === 'string' ? location : location?.name || ''}
        />
      )}

      {camera && camera !== 'N/A' && (
        <MetadataItem
          icon={<MdPhotoCamera />}
          label={t('widgets.background.camera')}
          value={camera}
        />
      )}

      <MetadataItem
        icon={<Resolution />}
        label={t('widgets.background.resolution')}
        value={`${width}x${height}`}
      />

      {colour && (
        <MetadataItem
          icon={<MdColorLens />}
          label={t('widgets.background.color')}
          value={<ColorSwatch hex={colour} />}
        />
      )}

      {category && (
        <MetadataItem
          icon={<Category />}
          label={t('widgets.background.category')}
          value={category[0].toUpperCase() + category.slice(1)}
        />
      )}

      {packDisplayName && (
        <MetadataItem
          icon={<Source />}
          label={t('widgets.background.source')}
          value={
            <span
              className="link pack-link"
              onClick={(e) => {
                e.stopPropagation();
                onPackClick(packId, packDisplayName);
              }}
            >
              {packDisplayName}
              <HiMiniArrowUpRight />
            </span>
          }
        />
      )}
    </div>
  );
}

/**
 * LocationMap - Displays interactive location map
 */
function LocationMap({ latitude, longitude }) {
  const t = useT();
  const tileUrl = `${variables.constants.API_URL}/map?latitude=${latitude}&longitude=${longitude}`;

  return (
    <div className="location-map-section">
      <a
        href={`${variables.constants.OPENSTREETMAP_URL}/?mlat=${latitude}&mlon=${longitude}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          className="location-map-image"
          src={tileUrl}
          alt={t('common.alt_text.location')}
          draggable={false}
        />
      </a>
      <div className="map-copyright">
        <a href="https://www.mapbox.com/about/maps/" target="_blank" rel="noopener noreferrer">
          © Mapbox
        </a>
        {' • '}
        <a href="https://www.openstreetmap.org/about/" target="_blank" rel="noopener noreferrer">
          © OpenStreetMap
        </a>
      </div>
    </div>
  );
}

/**
 * UnsplashStats - Displays Unsplash statistics (views, downloads, likes)
 */
function UnsplashStats({ views, downloads, likes }) {
  const t = useT();

  return (
    <div className="unsplashStats">
      <div className="stat-item" title={t('widgets.background.views')}>
        <Views />
        <span>{views.toLocaleString()}</span>
      </div>
      <div className="stat-item" title={t('widgets.background.downloads')}>
        <Download />
        <span>{downloads.toLocaleString()}</span>
      </div>
      {likes && (
        <div className="stat-item" title={t('widgets.background.likes')}>
          <MdFavourite />
          <span>{likes.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}

/**
 * ActionButtons - Photo action buttons (share, favorite, download, exclude)
 */
function ActionButtons({
  info,
  onShare,
  onExclude,
  onDownload,
  favouriteTooltipText,
  setFavouriteTooltipText,
}) {
  const t = useT();

  return (
    <div className="buttons">
      {!info.offline && (
        <Tooltip title={t('widgets.quote.share')} key="share" placement="top">
          <Share onClick={onShare} />
        </Tooltip>
      )}
      <Tooltip title={favouriteTooltipText} key="favourite" placement="top">
        <Favourite
          pun={info.pun}
          offline={info.offline}
          credit={info.credit}
          photoURL={info.url}
          tooltipText={(text) => setFavouriteTooltipText(text)}
        />
      </Tooltip>
      {!info.offline && (
        <Tooltip title={t('widgets.background.download')} key="download" placement="top">
          <Download onClick={onDownload} />
        </Tooltip>
      )}
      {info.pun && info.category && (
        <Tooltip title={t('widgets.background.exclude')} key="exclude" placement="top">
          <VisibilityOff onClick={onExclude} />
        </Tooltip>
      )}
    </div>
  );
}

function PhotoInformation({ info, url, api }) {
  const t = useT();
  const navigate = useNavigate();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [shareModal, openShareModal] = useState(false);
  const [excludeModal, openExcludeModal] = useState(false);
  const [favouriteTooltipText, setFavouriteTooltipText] = useState(t('widgets.quote.favourite'));

  // Handle pack link click
  const handlePackClick = (packId) => {
    navigate(`/discover/item/${packId}`);
  };

  // Helper to get primary text (description or location)
  const getPrimaryText = () => {
    if (info.description) {
      return info.description.length > 50
        ? info.description.substring(0, 50) + '...'
        : info.description;
    }
    if (typeof info.location === 'string') {
      return info.location.split(',').slice(-2).join(', ').trim();
    }
    return info.location?.name || 'Unknown Location';
  };

  if (info.hidden === true || !info.credit) {
    return null;
  }

  // Get attribution config for this photo
  const attributionConfig = getAttributionConfig(info);

  // Build photographer credit
  let credit = info.credit;
  if (attributionConfig.photographer_link && info.photographerURL) {
    const photographerUrl = addUTMParams(info.photographerURL, attributionConfig);
    credit = (
      <a href={photographerUrl} target="_blank" rel="noopener noreferrer">
        {info.credit}
      </a>
    );
  }

  // Add source platform credit
  if (attributionConfig.source_link && attributionConfig.source_name) {
    const sourceUrl = attributionConfig.source_url
      ? addUTMParams(attributionConfig.source_url, attributionConfig)
      : null;

    credit = (
      <>
        {credit}
        {' on '}
        {sourceUrl ? (
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
            {attributionConfig.source_name}
          </a>
        ) : (
          attributionConfig.source_name
        )}
      </>
    );
  }

  // Link "Photo" text to photo page
  let photo = t('widgets.background.credit');
  if (attributionConfig.photo_page_link && info.photoURL) {
    const photoUrl = addUTMParams(info.photoURL, attributionConfig);
    photo = (
      <a href={photoUrl} target="_blank" rel="noopener noreferrer">
        {photo}
      </a>
    );
  }

  // get resolution
  const img = new Image();
  img.onload = (event) => {
    setWidth(event.target.width);
    setHeight(event.target.height);
  };
  img.src = getProxiedImageUrl(url);

  // info is still there because we want the favourite button to work
  if (localStorage.getItem('photoInformation') === 'false') {
    return (
      <div style={{ display: 'none' }}>
        <span id="credit">{credit}</span>
        <span id="infoLocation">{info.location}</span>
        <span id="infoCamera">{info.camera}</span>
        <span id="infoResolution">
          {width}x{height}
        </span>
      </div>
    );
  }

  const widgetStyle = localStorage.getItem('widgetStyle');

  return (
    <div className="photoInformationHolder">
      <Modal
        closeTimeoutMS={300}
        isOpen={shareModal}
        className="Modal mainModal"
        overlayClassName="Overlay"
        ariaHideApp={false}
        onRequestClose={() => openShareModal(false)}
      >
        <ShareModal data={info.photoURL || info.url} modalClose={() => openShareModal(false)} />
      </Modal>
      <Modal
        closeTimeoutMS={300}
        isOpen={excludeModal}
        className="Modal mainModal"
        overlayClassName="Overlay"
        ariaHideApp={false}
        onRequestClose={() => openExcludeModal(false)}
      >
        <ExcludeModal info={info} modalClose={() => openExcludeModal(false)} />
      </Modal>
      {widgetStyle === 'legacy' && (
        <div className="photoInformation-legacy">
          <MdInfo />
          <span className="title">
            {photo} <span id="credit">{credit}</span>
          </span>
        </div>
      )}
      {widgetStyle !== 'legacy' && (
        <div className="photoInformation">
          {/* PRIMARY SECTION - Always Visible */}
          <div className="primary-content">
            <div className="photoInformation-text">
              <span className="title" title={info.description || ''}>
                {getPrimaryText()}
              </span>
              <span className="subtitle attribution" id="credit">
                {photo} {credit}
              </span>
            </div>
            {info.views && info.downloads !== null && (
              <UnsplashStats views={info.views} downloads={info.downloads} likes={info.likes} />
            )}
          </div>

          {/* EXPANDED SECTION - CSS :hover controlled */}
          <div className="extra-content">
            <MetadataGrid
              location={info.location}
              camera={info.camera}
              width={width}
              height={height}
              colour={info.colour}
              category={info.category}
              packId={info.pack_id}
              packName={info.pack_name}
              onPackClick={handlePackClick}
            />

            {localStorage.getItem('photoMap') === 'true' && info.latitude && info.longitude && (
              <>
                <div className="section-divider" />
                <LocationMap latitude={info.latitude} longitude={info.longitude} />
              </>
            )}

            <div className="buttons-wrapper">
              <ActionButtons
                info={info}
                onShare={() => openShareModal(true)}
                onExclude={() => openExcludeModal(true)}
                onDownload={() => downloadImage(info)}
                favouriteTooltipText={favouriteTooltipText}
                setFavouriteTooltipText={setFavouriteTooltipText}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(PhotoInformation);
