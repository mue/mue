import React from 'react';

import Info from '@material-ui/icons/Info';
import Location from '@material-ui/icons/LocationOn';
import Camera from '@material-ui/icons/PhotoCamera';
import Resolution from '@material-ui/icons/Crop';
import Photographer from '@material-ui/icons/Person';

export default function PhotoInformation(props) {
  const language = window.language.widgets.background;

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
        <span>{props.info.credit.split(' on Unsplash')[0]}</span>
      </div>
    </div>
  );
}
