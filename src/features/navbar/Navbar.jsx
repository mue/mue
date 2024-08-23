import variables from 'config/variables';
import { PureComponent, createRef } from 'react';

import { MdSettings } from 'react-icons/md';

import { Notes, Todo, Apps, Refresh, Maximise } from './components';
import { Tooltip } from 'components/Elements';
import defaults from './options/default';

import EventBus from 'utils/eventbus';

import './scss/index.scss';

class Navbar extends PureComponent {
  constructor() {
    super();
    this.navbarContainer = createRef();
    this.state = {
      classList: localStorage.getItem('widgetStyle') === 'legacy' ? 'navbar old' : 'navbar new',
      refreshText: '',
      refreshEnabled: localStorage.getItem('refresh') || defaults.refresh,
      refreshOption: localStorage.getItem('refreshOption') || defaults.refreshOption,
      appsOpen: false,
    };
  }

  setZoom() {
    this.setState({
      zoomFontSize:
        Number(((localStorage.getItem('zoomNavbar') || defaults.zoomNavbar) / 100) * 1.2) + 'rem',
    });
  }

  updateRefreshText() {
    let refreshText;
    switch (this.state.refreshOption) {
      case 'background':
        refreshText = variables.getMessage('settings:sections.background.title');
        break;
      case 'quote':
        refreshText = variables.getMessage('settings:sections.quote.title');
        break;
      case 'quotebackground':
        refreshText =
          variables.getMessage('settings:sections.quote.title') +
          ' ' +
          variables.getMessage('settings:sections.background.title');
        break;
      default:
        refreshText = variables.getMessage(
          'settings:sections.appearance.navbar.refresh_options.page',
        );
        break;
    }

    this.setState({
      refreshText,
    });
  }

  componentDidMount() {
    EventBus.on('refresh', (data) => {
      if (data === 'navbar' || data === 'background') {
        this.setState({
          refreshEnabled: localStorage.getItem('refresh'),
          refreshOption: localStorage.getItem('refreshOption'),
        });

        this.forceUpdate();

        try {
          this.updateRefreshText();
          this.setZoom();
        } catch (e) {}
      }
    });

    this.updateRefreshText();
    this.setZoom();
  }

  componentWillUnmount() {
    EventBus.off('refresh');
  }

  refresh() {
    switch (this.state.refreshOption) {
      case 'background':
        return EventBus.emit('refresh', 'backgroundrefresh');
      case 'quote':
        return EventBus.emit('refresh', 'quoterefresh');
      case 'quotebackground':
        EventBus.emit('refresh', 'quoterefresh');
        return EventBus.emit('refresh', 'backgroundrefresh');
      default:
        window.location.reload();
    }
  }

  render() {
    const backgroundEnabled = localStorage.getItem('background') === 'true';

    const navbar = (
      <div className="navbar-container">
        <div className={this.state.classList}>
          {localStorage.getItem('view') === 'true' && backgroundEnabled ? (
            <Maximise fontSize={this.state.zoomFontSize} />
          ) : null}
          {localStorage.getItem('notesEnabled') === 'true' && (
            <Notes fontSize={this.state.zoomFontSize} />
          )}
          {localStorage.getItem('todoEnabled') === 'true' && (
            <Todo fontSize={this.state.zoomFontSize} />
          )}
          {localStorage.getItem('appsEnabled') === 'true' && (
            <Apps fontSize={this.state.zoomFontSize} />
          )}

          {this.state.refreshEnabled !== 'false' && <Refresh fontSize={this.state.zoomFontSize} />}

          <Tooltip title={variables.getMessage('modals.main.navbar.settings')}>
            <button
              className="navbarButton"
              onClick={() => this.props.openModal('mainModal')}
              style={{ fontSize: this.state.zoomFontSize }}
              aria-label={variables.getMessage('modals.main.navbar.settings')}
            >
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

export { Navbar as default, Navbar };
