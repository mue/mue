import variables from 'config/variables';
import { useState, memo } from 'react';
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
} from 'react-icons/md';
import { Tooltip } from 'components/Elements';

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
  link.href = await toDataURL(info.url);
  link.download = `mue-${formatText(info.credit)}-${formatText(info.location)}.jpg`; // image is more likely to be webp or avif btw
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  variables.stats.postEvent('feature', 'Background download');
};

function PhotoInformation({ info, url, api }) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [usePhotoMap, setPhotoMap] = useState(false);
  const [useMapIcon, setMapIcon] = useState(true);
  const [showExtraInfo, setshowExtraInfo] = useState(false);
  //const [showOld, setShowOld] = useState(true);
  const [other, setOther] = useState(false);
  const [shareModal, openShareModal] = useState(false);
  const [excludeModal, openExcludeModal] = useState(false);
  const [favouriteTooltipText, setFavouriteTooltipText] = useState(
    variables.getMessage('widgets.quote.favourite'),
  );

  if (info.hidden === true || !info.credit) {
    return null;
  }

  let credit = info.credit;
  let photo = variables.getMessage('widgets.background.credit');

  // unsplash credit
  if (info.photographerURL && info.photographerURL !== '' && !info.offline && api) {
    photo = (
      <a href={info.photoURL} target="_blank" rel="noopener noreferrer">
        {photo}
      </a>
    );
    credit = (
      <>
        <a href={info.photographerURL} target="_blank" rel="noopener noreferrer">
          {info.credit}
        </a>
      </>
    );
  }

  // get resolution
  const img = new Image();
  img.onload = (event) => {
    setWidth(event.target.width);
    setHeight(event.target.height);
  };
  img.src = url;

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

  let showingPhotoMap = false;
  const photoMap = () => {
    if (
      localStorage.getItem('photoMap') !== 'true' ||
      !info.latitude ||
      !info.longitude ||
      usePhotoMap === false
    ) {
      return null;
    }

    const tile =
      variables.constants.API_URL + `/map?latitude=${info.latitude}&longitude=${info.longitude}`;
    showingPhotoMap = true;

    return (
      <a
        href={`${variables.constants.OPENSTREETMAP_URL}/?mlat=${info.latitude}&mlon=${info.longitude}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img className="locationMap" src={tile} alt="location" draggable={false} />
      </a>
    );
  };

  const InformationItems = () => {
    return (
      <div className="extra-content">
        {info.location && info.location !== 'N/A' ? (
          <div className="row" title={variables.getMessage('widgets.background.location')}>
            <MdLocationOn />
            <span id="infoLocation">{info.location}</span>
          </div>
        ) : null}
        {info.camera && info.camera !== 'N/A' ? (
          <div className="row" title={variables.getMessage('widgets.background.camera')}>
            <MdPhotoCamera />
            <span id="infoCamera">{info.camera}</span>
          </div>
        ) : null}
        <div className="row" title={variables.getMessage('widgets.background.resolution')}>
          <Resolution />
          <span id="infoResolution">
            {width}x{height}
          </span>
        </div>
        {info.category && (
          <div className="row" title={variables.getMessage('widgets.background.category')}>
            <Category />
            <span id="infoCategory">{info.category[0].toUpperCase() + info.category.slice(1)}</span>
          </div>
        )}
        {api && (
          <div className="row" title={variables.getMessage('widgets.background.source')}>
            <Source />
            <span id="infoSource">
              {info.photoURL ? (
                <a href={info.photoURL} target="_blank" rel="noopener noreferrer" className="link">
                  {api.charAt(0).toUpperCase() + api.slice(1)}
                </a>
              ) : (
                <a href={info.url} target="_blank" rel="noopener noreferrer" className="link">
                  {api.charAt(0).toUpperCase() + api.slice(1)}
                </a>
              )}
            </span>
          </div>
        )}
      </div>
    );
  };

  const ActionButtons = () => {
    return (
      <div className="buttons">
        {!info.offline && (
          <Tooltip title={variables.getMessage('widgets.quote.share')} key="share" placement="top">
            <Share onClick={() => openShareModal(true)} />
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
          <Tooltip
            title={variables.getMessage('widgets.background.download')}
            key="download"
            placement="top"
          >
            <Download onClick={() => downloadImage(info)} />
          </Tooltip>
        )}
        {info.pun && info.category && (
          <Tooltip
            title={variables.getMessage('widgets.background.exclude')}
            key="exclude"
            placement="top"
          >
            <VisibilityOff onClick={() => openExcludeModal(true)} />
          </Tooltip>
        )}
      </div>
    );
  };

  const UnsplashStats = () => {
    return (
      <div className="unsplashStats">
        <div title={variables.getMessage('widgets.background.views')}>
          <Views />
          <span>{info.views.toLocaleString()}</span>
        </div>
        <div title={variables.getMessage('widgets.background.downloads')}>
          <Download />
          <span>{info.downloads.toLocaleString()}</span>
        </div>
        {info.likes ? (
          <div title={variables.getMessage('widgets.background.likes')}>
            <MdFavourite />
            <span>{info.likes.toLocaleString()}</span>
          </div>
        ) : null}
      </div>
    );
  };

  let photoMapClassList = 'map-concept';
  if (photoMap() !== null) {
    photoMapClassList += ' photoMap';
  }

  // only request map image if the user looks at the photo information
  // this is to reduce requests to the api
  try {
    document.getElementsByClassName('photoInformation')[0].onmouseover = () => {
      try {
        setPhotoMap(true);
        setMapIcon(false);
      } catch {
        // Ignore errors
      }
    };
  } catch {
    // Element not found
  }

  const widgetStyle = localStorage.getItem('widgetStyle');

  return (
    <div
      className="photoInformationHolder"
      onMouseEnter={() => setOther(true)}
      onMouseLeave={() => setOther(false)}
    >
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
      {widgetStyle !== 'legacy' || other ? (
        <div
          className="photoInformation orHover"
          style={{ padding: widgetStyle === 'legacy' && '20px' }}
          onMouseEnter={() => setshowExtraInfo(true)}
          onMouseLeave={() => setshowExtraInfo(false)}
        >
          <div className={photoMapClassList}>
            {useMapIcon || photoMap() === null ? <MdLocationOn /> : ''}
            {photoMap()}
          </div>
          {showingPhotoMap && (
            <div className="copyright">
              <a
                href="https://www.mapbox.com/about/maps/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {' '}
                © Mapbox{' '}
              </a>{' '}
              •{' '}
              <a
                href="https://www.openstreetmap.org/about/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {' '}
                © OpenStreetMap{' '}
              </a>{' '}
              •{' '}
              <a
                href="https://www.mapbox.com/map-feedback/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {' '}
                Improve this map{' '}
              </a>
            </div>
          )}
          <div className="photoInformation-content">
            <div className="photoInformation-text">
              <span
                className="title"
                title={
                  (showExtraInfo || other) && info.description ? info.description : info.location
                }
              >
                {(showExtraInfo || other) && info.description
                  ? info.description.length > 40
                    ? info.description.substring(0, 40) + '...'
                    : info.description
                  : info.location?.split(',').slice(-2).join(', ').trim()}
              </span>
              <span className="subtitle" id="credit">
                {photo} {credit}
              </span>
            </div>
            {info.views && info.downloads !== null ? <UnsplashStats /> : null}
          </div>

          {(showExtraInfo || other) && excludeModal === false ? (
            <>
              <span className="subtitle">
                {variables.getMessage('widgets.background.information')}
              </span>
              <InformationItems />
              <ActionButtons />
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default memo(PhotoInformation);
