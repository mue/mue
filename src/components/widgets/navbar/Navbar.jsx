import variables from 'modules/variables';
import { PureComponent, createRef } from 'react';
import { MdRefresh, MdSettings, MdAssignment } from 'react-icons/md';

import Notes from './Notes';
import Todo from './Todo';
import Maximise from '../background/Maximise';
import Tooltip from 'components/helpers/tooltip/Tooltip';
import InfoTooltip from 'components/helpers/tooltip/infoTooltip';

import EventBus from 'modules/helpers/eventbus';

import './scss/index.scss';
import { FaThemeisle } from 'react-icons/fa';

export default class Navbar extends PureComponent {
  constructor() {
    super();
    this.navbarContainer = createRef();
    this.refreshEnabled = localStorage.getItem('refresh');
    this.refreshValue = localStorage.getItem('refreshOption');
    this.state = {
      classList: localStorage.getItem('widgetStyle') === 'legacy' ? 'navbar old' : 'navbar new',
    };
  }

  setZoom() {
    const zoomNavbar = Number((localStorage.getItem('zoomNavbar') || 100) / 100);
    this.navbarContainer.current.style.fontSize = `${zoomNavbar}em`;
  }

  componentDidMount() {
    EventBus.on('refresh', (data) => {
      if (data === 'navbar' || data === 'background') {
        this.refreshEnabled = localStorage.getItem('refresh');
        this.refreshValue = localStorage.getItem('refreshOption');
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
    const backgroundEnabled = localStorage.getItem('background') === 'true';

    const navbar = (
      <div className="navbar-container">
        <div className={this.state.classList} ref={this.navbarContainer}>
          {localStorage.getItem('view') === 'true' && backgroundEnabled ? <Maximise /> : null}
          {localStorage.getItem('notesEnabled') === 'true' ? <Notes /> : null}
          {localStorage.getItem('todo') === 'true' ? <Todo /> : null}

          {this.refreshEnabled !== 'false' ? (
            <Tooltip
              title={variables.language.getMessage(
                variables.languagecode,
                'widgets.navbar.tooltips.refresh',
              )}
            >
              <button onClick={() => this.refresh()}>
                <MdRefresh className="refreshicon topicons" />
              </button>
            </Tooltip>
          ) : null}

          <InfoTooltip
            title="You can now sync your settings"
            subtitle={'All settings, such as theme can now be synced across clients'}
            linkURL={'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
            linkText={'Learn more'}
          >
            <button onClick={() => this.props.openModal('mainModal')}>
              <MdSettings className="settings-icon topicons" />
            </button>
          </InfoTooltip>
        </div>
        {/*<div className="notification">
          <span className="title">New Update</span>
          <span className="subtitle">
            The newest update includes a lot of cheese plus urmm donate to david ralph on github.
          </span>
          <button>Learn More</button>
        </div>*/}
      </div>
    );

    return localStorage.getItem('navbarHover') === 'true' ? (
      <div className="navbar-hover">{navbar}</div>
    ) : (
      navbar
    );
  }
}
