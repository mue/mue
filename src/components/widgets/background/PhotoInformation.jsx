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
      <h1 id='photographer'>{language.credit}</h1>
      <Info className='photoInformationHover'/>
      <div className={props.className || 'infoCard'}>
        <Info className='infoIcon'/>
        <h1>{language.information}</h1>
        <hr/>
        <Location/>
        <span id='location'/>
        <Camera/>
        <span id='camera'/>
        <Resolution/>
        <span id='resolution'/>
        <Photographer/>
        <span id='photographerCard'/>
      </div>
      <span id='credit' style={{ 'display': 'none' }}></span>
    </div>
  );
}
