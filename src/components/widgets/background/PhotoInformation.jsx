import variables from 'modules/variables';
import { useState } from 'react';
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
} from 'react-icons/md';
import Tooltip from '../../helpers/tooltip/Tooltip';
import Modal from 'react-modal';
import ShareModal from '../../helpers/sharemodal/ShareModal';
//import Hotkeys from 'react-hot-keys';

const toDataURL = async (url) => {
  const res = await fetch(url);
  return URL.createObjectURL(await res.blob());
};

const formatText = (text) => {
  return text.toLowerCase().replaceAll(',', '').replaceAll(' ', '-');
};

const downloadImage = async (info) => {
  const link = document.createElement('a');
  link.href = await toDataURL(info.url);
  link.download = `mue-${formatText(info.credit)}-${formatText(info.location)}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  variables.stats.postEvent('feature', 'Background download');
};

const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

export default function PhotoInformation({ info, url, api }) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [usePhotoMap, setPhotoMap] = useState(false);
  const [setMapIcon] = useState(true);
  const [showExtraInfo, setshowExtraInfo] = useState(false);
  //const [showOld, setShowOld] = useState(true);
  const [other, setOther] = useState(false);
  const [shareModal, openShareModal] = useState(false);

  if (info.hidden === true || !info.credit) {
    return null;
  }

  // remove unsplash and pexels text
  const unsplash = variables.language.getMessage(
    variables.languagecode,
    'widgets.background.unsplash',
  );
  const pexels = variables.language.getMessage(variables.languagecode, 'widgets.background.pexels');

  let credit = info.credit;
  let photo = variables.language.getMessage(variables.languagecode, 'widgets.background.credit');

  // unsplash and pexels credit
  if (info.photographerURL && info.photographerURL !== '' && !info.offline && api) {
    if (api === 'unsplash') {
      photo = (
        <a href={info.photoURL + '?utm_source=mue'} target="_blank" rel="noopener noreferrer">
          {photo}
        </a>
      );
      credit = (
        <>
          <a href={info.photographerURL} target="_blank" rel="noopener noreferrer">
            {info.credit}
          </a>{' '}
          <a href="https://unsplash.com?utm_source=mue" target="_blank" rel="noopener noreferrer">
            {unsplash}
          </a>
        </>
      );
    } else {
      photo = (
        <a href={info.photoURL} target="_blank" rel="noopener noreferrer">
          {photo}
        </a>
      );
      credit = (
        <>
          <a href={info.photographerURL} target="_blank" rel="noopener noreferrer">
            {info.credit}
          </a>{' '}
          <a href="https://pexels.com" target="_blank" rel="noopener noreferrer">
            {pexels}
          </a>
        </>
      );
    }
  }

  const ddgProxy = localStorage.getItem('ddgProxy') === 'true';

  // get resolution
  const img = new Image();
  img.onload = (event) => {
    setWidth(event.target.width);
    setHeight(event.target.height);
  };
  img.src =
    ddgProxy && !info.offline && !url.startsWith('data:')
      ? variables.constants.DDG_IMAGE_PROXY + url
      : url;

  // info is still there because we want the favourite button to work
  if (localStorage.getItem('photoInformation') === 'false') {
    return (
      <div style={{ display: 'none' }}>
        <span id="credit">{credit}</span>
        <span id="infoLocation">{info.location || 'N/A'}</span>
        <span id="infoCamera">{info.camera || 'N/A'}</span>
        <span id="infoResolution">
          {width}x{height}
        </span>
      </div>
    );
  }

  /*const downloadEnabled =
    localStorage.getItem('downloadbtn') === 'true' && !info.offline && !info.photographerURL && api;
  const downloadBackground = () => {
    if (downloadEnabled) {
      downloadImage(info);
    }
  };

  const showBackgroundInformation = () => {
    const element = document.querySelector('.infoCard');
    if (element) {
      if (element.style.display === 'none' || element.style.display === '') {
        element.style.display = 'block';
      } else {
        element.style.display = 'none';
      }
    }
  };*/

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

    const zoom = 12;
    const tile = `${variables.constants.MAPBOX_URL}/styles/v1/mapbox/streets-v11/static/pin-s+555555(${info.longitude},${info.latitude})/${info.longitude},${info.latitude},${zoom},0/300x100?access_token=${info.maptoken}`;
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

  // only request map image if the user looks at the photo information
  // this is to reduce requests to the api
  try {
    document.getElementsByClassName('photoInformation')[0].onmouseover = () => {
      try {
        setPhotoMap(true);
        setMapIcon(false);
      } catch (e) {}
    };
  } catch (e) {}

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
      {localStorage.getItem('widgetStyle') === 'legacy' && (
        <div className="photoInformation-legacy">
          <MdInfo />
          <span className="title">
            {photo} <span id="credit">{credit}</span>
          </span>
        </div>
      )}
      {localStorage.getItem('widgetStyle') !== 'legacy' || other ? (
        <div
          className="photoInformation orHover"
          onMouseEnter={() => setshowExtraInfo(true)}
          onMouseLeave={() => setshowExtraInfo(false)}
        >
          <div className="map-concept">
            <MdLocationOn />
            {photoMap()}
          </div>
          {showingPhotoMap ? (
            <div className="concept-copyright">
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
          ) : null}
          <div className="photoInformation-content">
            <span className="title">{info.location}</span>
            <span className="subtitle" id="credit">
              {credit}
            </span>
            {info.views && info.downloads !== null ? (
              <div className="concept-stats">
                <div>
                  <Views />
                  <span>{info.views.toLocaleString()}</span>
                </div>
                <div>
                  <Download />
                  <span>{info.downloads.toLocaleString()}</span>
                </div>
              </div>
            ) : null}
          </div>

          {showExtraInfo || other ? (
            <>
              <div className="concept-buttons">
                <Tooltip title={getMessage('widgets.quote.share')} key="share">
                  <Share onClick={() => openShareModal(true)} />
                </Tooltip>
                <Tooltip title={getMessage('widgets.quote.favourite')} key="favourite">
                  <Favourite />
                </Tooltip>
                <Tooltip title={getMessage('widgets.background.download')} key="download">
                  <Download onClick={() => downloadImage(info)} />
                </Tooltip>
              </div>
              <div className="extra-content">
                <span className="subtitle">
                  {variables.language.getMessage(
                    variables.languagecode,
                    'widgets.background.information',
                  )}
                </span>
                {info.location && info.location !== 'N/A' ? (
                  <div className="concept-row">
                    <MdLocationOn />
                    <span id="infoLocation">{info.location}</span>
                  </div>
                ) : null}
                {info.camera && info.camera !== 'N/A' ? (
                  <div className="concept-row">
                    <MdPhotoCamera />
                    <span id="infoCamera">{info.camera}</span>
                  </div>
                ) : null}
                <div className="concept-row">
                  <Resolution />
                  <span id="infoResolution">
                    {width}x{height}
                  </span>
                </div>
                {api ? (
                  <div className="concept-row">
                    <Source />
                    <span id="infoSource">{api.charAt(0).toUpperCase() + api.slice(1)}</span>
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
