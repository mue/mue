import React from 'react';
import RefreshIcon from '@material-ui/icons/RefreshRounded';
import Gear from '@material-ui/icons/SettingsRounded';
import NewReleases from '@material-ui/icons/NewReleasesRounded';
import NotesIcon from '@material-ui/icons/AssignmentRounded';
import Tooltip from '@material-ui/core/Tooltip';

const Notes = React.lazy(() => import('./widgets/Notes'));
const renderLoader = () => <div></div>;

export default class Navbar extends React.PureComponent {
  render() {
    let refreshHTML = <RefreshIcon className='refreshicon topicons' onClick={() => window.location.reload()} />
    const refresh = localStorage.getItem('refresh');
    if (refresh === 'false') refreshHTML = '';

    return (
      <div className='navbar-container'>
        <div className='notes'>
          <NotesIcon className='topicons' />
          <React.Suspense fallback={renderLoader()}>
            <Notes/>
          </React.Suspense>
        </div>
        <div className={refresh === 'false' ? 'navbar2' : 'navbar3'}>
        <Tooltip title='Update Patch Notes' placement='top'>
          <NewReleases className='refreshicon topicons' onClick={this.props.updateModalOpen} />
        </Tooltip>
        </div>
        <Tooltip title='Refresh Page'>
          {refreshHTML}
        </Tooltip>
        <Tooltip title='Settings' placement='top'>
          <Gear className='settings-icon topicons' onClick={this.props.mainModalOpen} />
        </Tooltip>
      </div>
    );
  }
}
