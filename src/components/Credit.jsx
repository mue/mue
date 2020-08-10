/* eslint-disable jsx-a11y/heading-has-content */
import RoomIcon from '@material-ui/icons/Room';
import React from 'react';

export default class Credit extends React.PureComponent {
  render() {
    return (
      <div className='credits'>
          {/*<h1 id='location'></h1>*/}
          <h1 id='photographer'>{this.props.language}</h1>
          <div id='backgroundCredits' className='tooltip'>
            <RoomIcon className='locationicon'/>
            <span className='tooltiptext' id='location'/>
          </div>
        </div>
    );
  }
}