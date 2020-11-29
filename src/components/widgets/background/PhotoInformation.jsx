import React from 'react';
import Info from '@material-ui/icons/Info';
import Location from '@material-ui/icons/LocationOn';
import Camera from '@material-ui/icons/PhotoCamera';
import Resolution from '@material-ui/icons/Crop';
import Photographer from '@material-ui/icons/Person';

export default class PhotoInformation extends React.PureComponent {
  render() {
    return (
      <div className='photoInformation'>
        <h1 id='photographer'>{this.props.language.credit}</h1>
        <Info className='photoInformationHover'/>
        <div className='infoCard'>
          <Info className='infoIcon'/>
          <h1>{this.props.language.information}</h1>
          <hr/>
          <Location/>
          <span id='location'></span>
          <Camera/>
          <span id='camera'></span>
          <Resolution/>
          <span id='resolution'></span>
          <Photographer/>
          <span id='photographerCard'></span>
        </div>
        <div id='backgroundCredits' className='tooltip'>
          <span className='tooltiptext' id='location'/>
        </div>
        <span id='credit' style={{ 'display': 'none' }}></span>
      </div>
    );
  }
}
