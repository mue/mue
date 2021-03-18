import React from 'react';

import RefreshIcon from '@material-ui/icons/RefreshRounded';
import Gear from '@material-ui/icons/SettingsRounded';
import NotesIcon from '@material-ui/icons/AssignmentRounded';
import Tooltip from '@material-ui/core/Tooltip';
import Report from '@material-ui/icons/SmsFailed';

import * as Constants from '../../../modules/constants';

import './scss/index.scss';

// the user probably won't use the notes feature every time so we lazy load
const Notes = React.lazy(() => import('./Notes'));
const renderLoader = () => <div></div>;

export default class Navbar extends React.PureComponent {
  render() {
    // toggle refresh button
    let refreshHTML = (
      <Tooltip title={this.props.language.widgets.navbar.tooltips.refresh}>
        <RefreshIcon className='refreshicon topicons' onClick={() => window.location.reload()} />
      </Tooltip>
    );

    if (localStorage.getItem('refresh') === 'false') {
      refreshHTML = null;
    }

    // toggle feedback button
    let feedbackHTML = (
      <Tooltip title='Feedback' placement='top'>
        <Report className='topicons' onClick={() => this.props.openModal('feedbackModal')} />
      </Tooltip>
    );

    if (Constants.BETA_VERSION === false) {
      feedbackHTML = null;
    }

    // toggle notes
    let notesHTML = (
      <div className='notes'>
        <NotesIcon className='topicons'/>
        <React.Suspense fallback={renderLoader()}>
          <Notes language={this.props.language.widgets.navbar.notes} />
        </React.Suspense>
      </div>
    );

    if (localStorage.getItem('notesEnabled') === 'false') {
      notesHTML = null;
    }

    return (
      <div className='navbar-container'>
        {notesHTML}
        {feedbackHTML}
        {refreshHTML}
        <Tooltip title={this.props.language.modals.main.navbar.settings} placement='top'>
          <Gear className='settings-icon topicons' onClick={() => this.props.openModal('mainModal')} />
        </Tooltip>
      </div>
    );
  }
}
