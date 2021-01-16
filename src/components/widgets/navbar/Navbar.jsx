import React from 'react';

import RefreshIcon from '@material-ui/icons/RefreshRounded';
import Gear from '@material-ui/icons/SettingsRounded';
import NewReleases from '@material-ui/icons/NewReleasesRounded';
import NotesIcon from '@material-ui/icons/AssignmentRounded';
import Tooltip from '@material-ui/core/Tooltip';
import Report from '@material-ui/icons/SmsFailed';

import * as Constants from '../../../modules/constants';

import './scss/index.scss';

const Notes = React.lazy(() => import('./Notes')); // the user probably won't use the notes feature every time so we lazy load
const renderLoader = () => <div></div>;

export default class Navbar extends React.PureComponent {
  render() {
    // toggle refresh button
    let refreshHTML = (
      <Tooltip title={this.props.language.navbar.tooltips.refresh}>
        <RefreshIcon className='refreshicon topicons' onClick={() => window.location.reload()} />
      </Tooltip>
    );

    if (localStorage.getItem('refresh') === 'false') refreshHTML = null;

    // toggle feedback button
    let feedbackHTML = (
      <Tooltip title='Feedback' placement='top'>
        <Report className='topicons' onClick={this.props.feedbackModalOpen} />
      </Tooltip>
    );
  
    if (Constants.BETA_VERSION === false) feedbackHTML = null;

    return (
      <div className='navbar-container'>
        <div className='notes'>
          <NotesIcon className='topicons'/>
          <React.Suspense fallback={renderLoader()}>
            <Notes language={this.props.language.navbar.notes} />
          </React.Suspense>
        </div>
        {feedbackHTML}
        <Tooltip title={this.props.language.navbar.tooltips.update} placement='top'>
          <NewReleases className='refreshicon topicons' onClick={this.props.updateModalOpen} />
        </Tooltip>
        {refreshHTML}
        <Tooltip title={this.props.language.modals.settings} placement='top'>
          <Gear className='settings-icon topicons' onClick={this.props.mainModalOpen} />
        </Tooltip>
      </div>
    );
  }
}
