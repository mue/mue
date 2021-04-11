import React from 'react';

import Info from '@material-ui/icons/Info';
import Location from '@material-ui/icons/LocationOn';
import Camera from '@material-ui/icons/PhotoCamera';
import Resolution from '@material-ui/icons/Crop';
import Photographer from '@material-ui/icons/Person';
import Download from '@material-ui/icons/GetApp';

const toDataURL = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
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

  if (props.info.hidden === true) {
    return null;
  }

  return (
    <div className='photoInformation' style={{'display': 'none'}}>
      <h1>{language.credit} <span id='credit'>{props.info.credit}</span></h1>
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
        <span>{props.info.credit.split(` ${language.unsplash}`)[0]}</span>
        {(localStorage.getItem('downloadbtn') === 'true') ? 
          <>
            <Download/>
            <span className='download' onClick={() => downloadImage(props.info)}>{language.download}</span>
          </> : null}
      </div>
    </div>
  );
}
