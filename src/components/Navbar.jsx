//* Imports
import RefreshIcon from '@material-ui/icons/Refresh';
import Gear from '@material-ui/icons/Settings';
import NewReleases from '@material-ui/icons/NewReleases';
import React from 'react';

export default class Navbar extends React.Component {
  render() {
    return (
      <div className='navbar-container'>
        <div className='navbar1'>
          <Gear className='settings-icon' onClick={this.props.settingsModalOpen} />
        </div>
        <div className='navbar2'>
            <RefreshIcon className='refreshicon' onClick={() => window.location.reload()} />
        </div>
        <div className='navbar3'>
            <NewReleases className='refreshicon' onClick={this.props.updateModalOpen} />
        </div>
      </div>
    );
  }
}