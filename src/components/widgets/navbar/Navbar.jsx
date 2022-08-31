import variables from 'modules/variables';
import { PureComponent, createRef } from 'react';
import { MdRefresh, MdSettings } from 'react-icons/md';

import Notes from './Notes';
import Todo from './Todo';
import Maximise from '../background/Maximise';
import Tooltip from 'components/helpers/tooltip/Tooltip';

import EventBus from 'modules/helpers/eventbus';

import './scss/index.scss';

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
        try {
          this.setZoom();
        } catch (e) {}
      }
    });

    this.setZoom();
  }

  refresh() {
    switch (this.refreshValue) {
      case 'background':
        return EventBus.dispatch('refresh', 'backgroundrefresh');
      case 'quote':
        return EventBus.dispatch('refresh', 'quoterefresh');
      case 'quotebackground':
        EventBus.dispatch('refresh', 'quoterefresh');
        return EventBus.dispatch('refresh', 'backgroundrefresh');
      default:
        window.location.reload();
    }
  }

  render() {
    const backgroundEnabled = localStorage.getItem('background') === 'true';

    const navbar = (
      <div className="navbar-container" ref={this.navbarContainer}>
        <div className={this.state.classList}>
          {localStorage.getItem('view') === 'true' && backgroundEnabled ? <Maximise /> : null}
          {localStorage.getItem('notesEnabled') === 'true' ? <Notes /> : null}
          {localStorage.getItem('todo') === 'true' ? <Todo /> : null}

          {this.refreshEnabled !== 'false' ? (
            <Tooltip title={variables.getMessage('widgets.navbar.tooltips.refresh')}>
              <button onClick={() => this.refresh()}>
                <MdRefresh className="refreshicon topicons" />
              </button>
            </Tooltip>
          ) : null}

          {/*<InfoTooltip
            title="You can now sync your settings"
            subtitle={'All settings, such as theme can now be synced across clients'}
            linkURL={'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
            linkText={'Learn more'}
              >
              </InfoTooltip>*/}
          <Tooltip
            title={variables.getMessage('modals.main.navbar.settings', {
              type: variables.getMessage(
                'modals.main.navbar.tooltips.refresh_' + this.refreshValue,
              ),
            })}
          >
            <button onClick={() => this.props.openModal('mainModal')}>
              <MdSettings className="settings-icon topicons" />
            </button>
          </Tooltip>
        </div>
      </div>
    );

    return localStorage.getItem('navbarHover') === 'true' ? (
      <div className="navbar-hover">{navbar}</div>
    ) : (
      navbar
    );
  }
}
