import React from 'react';

import Info from '@material-ui/icons/Info';
import Location from '@material-ui/icons/LocationOn';
import Camera from '@material-ui/icons/PhotoCamera';
import Resolution from '@material-ui/icons/Crop';
import Photographer from '@material-ui/icons/Person';

const toDataURL = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

const downloadImage = async (info) => {
  const link = document.createElement('a');
  link.href = await toDataURL(info.url);
  // todo: make this a bit cleaner
  link.download = `mue-${info.credit.toLowerCase().replaceAll(' ', '-')}-${info.location.toLowerCase().replaceAll(',', '').replaceAll(' ', '-')}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function PhotoInformation(props) {
  const language = window.language.widgets.background;

  if (props.info.hidden === true) {
    return null;
  }

  return (
    <div className='photoInformation'>
      <h1>{language.credit} {props.info.credit}</h1>
      <Info className='photoInformationHover'/>
      <div className={props.className || 'infoCard'}>
        <Info className='infoIcon'/>
        <h1>{language.information}</h1>
        <hr/>
        <Location/>
        <span>{props.info.location}</span>
        <Camera/>
        <span>{props.info.camera}</span>
        <Resolution/>
        <span>{props.info.resolution}</span>
        <Photographer/>
        <span>{props.info.credit.split(` ${language.unsplash}`)[0]}</span>
        <button className='download' onClick={() => downloadImage(props.info)}>{language.download}</button>
      </div>
    </div>
  );
}
