import React from 'react';

import Info from '@material-ui/icons/Info';
import Location from '@material-ui/icons/LocationOn';
import Camera from '@material-ui/icons/PhotoCamera';
import Resolution from '@material-ui/icons/Crop';
import Photographer from '@material-ui/icons/Person';
import Download from '@material-ui/icons/GetApp';

const toDataURL = async (url) => {
  const res = await fetch(url);
  return URL.createObjectURL(await res.blob());
};

const downloadImage = async (info) => {
  const link = document.createElement('a');
  link.href = await toDataURL(info.url);
  // todo: make this a bit cleaner
  link.download = `mue-${info.credit.toLowerCase().replaceAll(' ', '-')}-${info.location.toLowerCase().replaceAll(',', '').replaceAll(' ', '-')}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function PhotoInformation(props) {
  const language = window.language.widgets.background;

  if (props.info.hidden === true || !props.info.credit) {
    return null;
  }

  // remove unsplash text
  const photographer = props.info.credit.split(` ${language.unsplash}`)[0];

  let credit = props.info.credit;
  let photo = language.credit;

  // unsplash
  if (props.info.photographerURL !== '' && !props.info.offline) {
    photo = <a href={props.info.photoURL} target='_blank' rel='noopener noreferrer'>{language.credit}</a>;
    credit = <><a href={props.info.photographerURL} target='_blank' rel='noopener noreferrer'>{photographer}</a> <a href='https://unsplash.com?utm_source=mue' target='_blank' rel='noopener noreferrer'>{language.unsplash}</a></>;
  }

  return (
    <div className='photoInformation'>
      <h1>{photo} <span id='credit'>{credit}</span></h1>
      <Info className='photoInformationHover'/>
      <div className={props.className || 'infoCard'}>
        <Info className='infoIcon'/>
        <h1>{language.information}</h1>
        <hr/>
        <Location/>
        <span>{props.info.location || 'N/A'}</span>
        <Camera/>
        <span>{props.info.camera || 'N/A'}</span>
        <Resolution/>
        <span>{props.info.resolution || 'N/A'}</span>
        <Photographer/>
        <span>{photographer}</span>
        {(localStorage.getItem('downloadbtn') === 'true') && !props.info.offline && !props.info.photographerURL ? 
          <>
            <Download/>
            <span className='download' onClick={() => downloadImage(props.info)}>{language.download}</span>
          </> : null}
      </div>
    </div>
  );
}
