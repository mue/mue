import React from 'react';
import RefreshIcon from '@material-ui/icons/Refresh';
import Gear from '@material-ui/icons/Settings';
import NewReleases from '@material-ui/icons/NewReleases';

export default class Navbar extends React.PureComponent {
  render() {
    let refreshHTML = <div className='navbar2' ><RefreshIcon className='refreshicon' onClick={() => window.location.reload()} /></div>
    const refresh = localStorage.getItem('refresh');
    if (refresh === 'false') refreshHTML = '';

    const viewedUpdate = localStorage.getItem('viewedUpdate');
    let update = <NewReleases className='refreshicon' onClick={this.props.updateModalOpen} />;
    if (viewedUpdate === 'false') update =  <NewReleases className='refreshicon' onClick={this.props.updateModalOpen} />

    return (
      <div className='navbar-container'>
        <div className='navbar1'>
          <Gear className='settings-icon' onClick={this.props.settingsModalOpen} />
        </div>
        {refreshHTML}
        <div className={refresh === 'false' ? 'navbar2' : 'navbar3'}>
        {update}
        </div>
      </div>
    );
  }
}