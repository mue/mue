import { PureComponent } from 'react';

import RefreshIcon from '@material-ui/icons/RefreshRounded';
import Gear from '@material-ui/icons/SettingsRounded';
import NotesIcon from '@material-ui/icons/AssignmentRounded';
import Report from '@material-ui/icons/SmsFailed';

import Notes from './Notes';
import Maximise from '../background/Maximise';
import Favourite from '../background/Favourite';
import Tooltip from '../../helpers/tooltip/Tooltip';

import EventBus from '../../../modules/helpers/eventbus';

import './scss/index.scss';

export default class Navbar extends PureComponent {
  componentDidMount() {
    EventBus.on('refresh', (data) => {
      if (data === 'navbar') {
        this.forceUpdate();
      }
    });
  }

  render() {
    if (localStorage.getItem('showWelcome') !== 'false') {
      return null;
    }
  
    const backgroundEnabled = (localStorage.getItem('background') === 'true');
  
    return (
      <div className='navbar-container'>
        {(localStorage.getItem('view') === 'true' && backgroundEnabled) ? <Maximise/> : null}
        {(localStorage.getItem('favouriteEnabled') === 'true' && backgroundEnabled) ? <Favourite/> : null}
    
        {(localStorage.getItem('notesEnabled') === 'true') ?
          <div className='notes'>
            <NotesIcon className='topicons'/>
            <Notes/>
          </div>
        : null}
  
        {(window.constants.BETA_VERSION === true) ? 
          <Tooltip title={window.language.widgets.navbar.tooltips.feedback}>
            <Report className='topicons' onClick={() => this.props.openModal('feedbackModal')}/>
          </Tooltip>
        : null}
  
        {(localStorage.getItem('refresh') === 'true') ?
          <Tooltip title={window.language.widgets.navbar.tooltips.refresh}>
            <RefreshIcon className='refreshicon topicons' onClick={() => window.location.reload()}/>
          </Tooltip>
        : null}
  
        <Tooltip title={window.language.modals.main.navbar.settings}>
          <Gear className='settings-icon topicons' onClick={() => this.props.openModal('mainModal')}/>
        </Tooltip>
      </div>
    );
  }
}
