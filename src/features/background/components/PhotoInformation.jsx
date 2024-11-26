import variables from 'config/variables';
import { useState, memo, useEffect, useCallback } from 'react';
import { MdInfo, MdLocationOn } from 'react-icons/md';
import Modal from 'react-modal';
import { ShareModal } from 'components/Elements';
import ExcludeModal from './ExcludeModal';
import InformationItems from './InformationItems';
import ActionButtons from './ActionButtons';
import UnsplashStats from './UnsplashStats';

function PhotoInformation({ info, url, api }) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [usePhotoMap, setPhotoMap] = useState(false);
  const [useMapIcon, setMapIcon] = useState(true);
  const [showExtraInfo, setShowExtraInfo] = useState(false);
  const [other, setOther] = useState(false);
  const [shareModal, openShareModal] = useState(false);
  const [excludeModal, openExcludeModal] = useState(false);
  const [favouriteTooltipText, setFavouriteTooltipText] = useState(
    variables.getMessage('widgets.quote.favourite'),
  );

  useEffect(() => {
    const img = new Image();
    img.onload = (event) => {
      setWidth(event.target.width);
      setHeight(event.target.height);
    };
    img.src = url;
  }, [url]);

  const photoMap = useCallback(() => {
    if (
      localStorage.getItem('photoMap') !== 'true' ||
      !info.latitude ||
      !info.longitude ||
      usePhotoMap === false
    ) {
      return null;
    }

    const tile = `${variables.constants.API_URL}/map?latitude=${info.latitude}&longitude=${info.longitude}`;
    return (
      <a
        href={`${variables.constants.OPENSTREETMAP_URL}/?mlat=${info.latitude}&mlon=${info.longitude}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img className="locationMap" src={tile} alt="location" draggable={false} />
      </a>
    );
  }, [info.latitude, info.longitude, usePhotoMap]);

  useEffect(() => {
    const photoInformationElement = document.getElementsByClassName('photoInformation')[0];
    if (photoInformationElement) {
      photoInformationElement.onmouseover = () => {
        setPhotoMap(true);
        setMapIcon(false);
      };
    }
  }, []);

  if (info.hidden === true || !info.credit) {
    return null;
  }

  let credit = info.credit;
  let photo = variables.getMessage('widgets.background.credit');

  if (info.photographerURL && info.photographerURL !== '' && !info.offline && api) {
    photo = (
      <a href={info.photoURL} target="_blank" rel="noopener noreferrer">
        {photo}
      </a>
    );
    credit = (
      <a href={info.photographerURL} target="_blank" rel="noopener noreferrer">
        {info.credit}
      </a>
    );
  }

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

  let photoMapClassList = 'map-concept';
  if (photoMap() !== null) {
    photoMapClassList += ' photoMap';
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
      {(widgetStyle !== 'legacy' || other) && (
        <div
          className="photoInformation orHover"
          style={{ padding: widgetStyle === 'legacy' && '20px' }}
          onMouseEnter={() => setShowExtraInfo(true)}
          onMouseLeave={() => setShowExtraInfo(false)}
        >
          <div className={photoMapClassList}>
            {useMapIcon || photoMap() === null ? <MdLocationOn /> : ''}
            {photoMap()}
          </div>
          {photoMap() && (
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
                    ? `${info.description.substring(0, 40)}...`
                    : info.description
                  : info.location?.split(',').slice(-2).join(', ').trim()}
              </span>
              <span className="subtitle" id="credit">
                {photo} {credit}
              </span>
            </div>
            {info.views && info.downloads !== null && <UnsplashStats info={info} />}
          </div>
          {(showExtraInfo || other) && !excludeModal && (
            <>
              <span className="subtitle">
                {variables.getMessage('widgets.background.information')}
              </span>
              <InformationItems info={info} width={width} height={height} api={api} />
              <ActionButtons
                info={info}
                favouriteTooltipText={favouriteTooltipText}
                setFavouriteTooltipText={setFavouriteTooltipText}
                openShareModal={openShareModal}
                openExcludeModal={openExcludeModal}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(PhotoInformation);
