import variables from 'modules/variables';
import { PureComponent, createRef } from 'react';
import { MdRefresh, MdSettings, MdAssignment } from 'react-icons/md';

import Notes from './Notes';
import Maximise from '../background/Maximise';
import Favourite from '../background/Favourite';
import Tooltip from 'components/helpers/tooltip/Tooltip';

import EventBus from 'modules/helpers/eventbus';

import './scss/index.scss';

export default class Navbar extends PureComponent {
  constructor() {
    super();
    this.navbarContainer = createRef();
    this.refreshValue = localStorage.getItem('refresh');
  }

  setZoom() {
    const zoomNavbar = Number((localStorage.getItem('zoomNavbar') || 100) / 100);
    this.navbarContainer.current.style.fontSize = `${zoomNavbar}em`;
  }

  componentDidMount() {
    EventBus.on('refresh', (data) => {
      if (data === 'navbar' || data === 'background') {
        this.refreshValue = localStorage.getItem('refresh');
        this.forceUpdate();
        this.setZoom();
      }
    });

    this.setZoom();
  }

  refresh() {
    switch (this.refreshValue) { 
      case 'background':
        EventBus.dispatch('refresh', 'backgroundrefresh');
        break;
      case 'quote':
        EventBus.dispatch('refresh', 'quoterefresh');
        break;
      case 'quotebackground':
        EventBus.dispatch('refresh', 'quoterefresh');
        EventBus.dispatch('refresh', 'backgroundrefresh');
        break;
      default:
        window.location.reload();
    }
  }

  render() {
    const backgroundEnabled = (localStorage.getItem('background') === 'true');

    const navbar = (
      <div className='navbar-container' ref={this.navbarContainer}>
        {(localStorage.getItem('view') === 'true' && backgroundEnabled) ? <Maximise/> : null}
        {(localStorage.getItem('favouriteEnabled') === 'true' && backgroundEnabled) ? <Favourite/> : null}
    
        {(localStorage.getItem('notesEnabled') === 'true') ?
          <div className='notes'>
            <MdAssignment className='topicons'/>
            <Notes/>
          </div>
        : null}

        {(this.refreshValue !== 'false') ?
          <Tooltip title={variables.language.getMessage(variables.languagecode, 'widgets.navbar.tooltips.refresh')}>
            <MdRefresh className='refreshicon topicons' onClick={() => this.refresh()}/>
          </Tooltip>
        : null}
  
        <Tooltip title={variables.language.getMessage(variables.languagecode, 'modals.main.navbar.settings')}>
          <MdSettings className='settings-icon topicons' onClick={() => this.props.openModal('mainModal')}/>
        </Tooltip>
      </div>
    );

    if (localStorage.getItem('navbarHover') === 'true') {
      return <div className='navbar-hover'>{navbar}</div>;
    } else {
      return navbar;
    }
  }
}
