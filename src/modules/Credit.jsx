/* eslint-disable */
import RoomIcon from '@material-ui/icons/Room';
import React from 'react';

export default class Search extends React.Component {
  render() {
    return (
      <div class='credits'>
          {/* <h1 id='location'></h1> */}
          <h1 id='photographer'></h1>
          <div id='backgroundCredits' class='tooltip'><RoomIcon classname='locationicon'/>
            <span class='tooltiptext' id='location'></span>
          </div>
     </div>
    );
  }
}