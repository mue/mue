/* eslint-disable */
//* Imports
import RoomIcon from '@material-ui/icons/Room';
import React from 'react';

export default class Search extends React.Component {
  render() {
    return (
      <div className='credits'>
          {/* <h1 id='location'></h1> */}
          <h1 id='photographer'></h1>
          <div id='backgroundCredits' className='tooltip'><RoomIcon className='locationicon'/>
            <span className='tooltiptext' id='location'></span>
          </div>
     </div>
    );
  }
}