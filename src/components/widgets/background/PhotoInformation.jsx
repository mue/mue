import { useState, Fragment } from 'react';
import { Info, LocationOn, PhotoCamera, Crop as Resolution, Person as Photographer, GetApp as Download } from '@material-ui/icons';
import Hotkeys from 'react-hot-keys';
import { lat2tile, lon2tile } from 'modules/helpers/background/widget';

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
  window.stats.postEvent('feature', 'Background download');
};

export default function PhotoInformation({ info, url, api }) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const language = window.language.widgets.background;

  if (info.hidden === true || !info.credit) {
    return null;
  }

  // remove unsplash and pexels text
  const photographer = info.credit.split(` ${language.unsplash}`)[0].split(` ${language.pexels}`);

  let credit = info.credit;
  let photo = language.credit;

  // unsplash and pexels credit
  if (info.photographerURL && info.photographerURL !== '' && !info.offline && api) {
    if (api === 'unsplash') {
      photo = <a href={info.photoURL + '?utm_source=mue'} target='_blank' rel='noopener noreferrer'>{language.credit}</a>;
      credit = <><a href={info.photographerURL} target='_blank' rel='noopener noreferrer'>{photographer}</a> <a href='https://unsplash.com?utm_source=mue' target='_blank' rel='noopener noreferrer'>{language.unsplash}</a></>;
    } else {
      photo = <a href={info.photoURL} target='_blank' rel='noopener noreferrer'>{language.credit}</a>;
      credit = <><a href={info.photographerURL} target='_blank' rel='noopener noreferrer'>{photographer}</a> <a href='https://pexels.com' target='_blank' rel='noopener noreferrer'>{language.pexels}</a></>;
    }
  }

  const ddgProxy = (localStorage.getItem('ddgProxy') === 'true');

  // get resolution
  const img = new Image();
  img.onload = (event) => {
    setWidth(event.target.width);
    setHeight(event.target.height);
  };
  img.src = (ddgProxy && !info.offline && !url.startsWith('data:')) ? window.constants.DDG_IMAGE_PROXY + url : url;

  // info is still there because we want the favourite button to work
  if (localStorage.getItem('photoInformation') === 'false') {
    return (
      <div className='photoInformation'>
        <h1>{photo} <span id='credit'>{credit}</span></h1>
        <div style={{ display: 'none' }}>
          <span id='infoLocation'>{info.location || 'N/A'}</span>
          <span id='infoCamera'>{info.camera || 'N/A'}</span>
          <span id='infoResolution'>{width}x{height}</span>
        </div>
      </div>
    );
  }

  const downloadEnabled = (localStorage.getItem('downloadbtn') === 'true') && !info.offline && !info.photographerURL;
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
  };

  const photoMap = () => {
    if (localStorage.getItem('photoMap') !== 'true' || info.latitude === null || info.longitude === null) {
      return null;
    }

    const lat = lat2tile(info.latitude, 12);
    const lon = lon2tile(info.longitude, 12);
    const tile = `https://a.tile.openstreetmap.org/12/${lon}/${lat}.png`;

    return (
      <img src={ddgProxy ? window.constants.DDG_IMAGE_PROXY + tile : tile} alt='location' draggable={false}/>
    );
  }

  return (
    <div className='photoInformation'>
      <h1>{photo} <span id='credit'>{credit}</span></h1>
      <Info className='photoInformationHover'/>
      <div className='infoCard'>
        <Info className='infoIcon'/>
        <h1>{language.information}</h1>
        <hr/>
        {photoMap()}
        {/* fix console error by using fragment and key */}
        {info.location && info.location !== 'N/A' ? <Fragment key='location'>
          <LocationOn/>
          <span id='infoLocation'>{info.location}</span>
        </Fragment> : null}
        {info.camera && info.camera !== 'N/A' ? <Fragment key='camera'>
          <PhotoCamera/>
          <span id='infoCamera'>{info.camera}</span>
        </Fragment> : null}
        <Resolution/>
        <span id='infoResolution'>{width}x{height}</span>
        <Photographer/>
        <span>{photographer}</span>
        {downloadEnabled ? 
          <>
            <Download/>
            <span className='download' onClick={() => downloadImage(info)}>{language.download}</span>
          </> 
        : null}
      </div>
      {window.keybinds.downloadBackground && window.keybinds.downloadBackground !== '' ? <Hotkeys keyName={window.keybinds.downloadBackground} onKeyDown={() => downloadBackground()} /> : null}
      {window.keybinds.showBackgroundInformation && window.keybinds.showBackgroundInformation !== '' ? <Hotkeys keyName={window.keybinds.showBackgroundInformation} onKeyDown={() => showBackgroundInformation()} /> : null}
    </div>
  );
}
