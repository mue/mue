import variables from 'modules/variables';
import { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';

import { MdRefresh, MdSettings } from 'react-icons/md';

import Notes from './Notes';
import Todo from './Todo';
import Maximise from '../background/Maximise';
import Tooltip from 'components/helpers/tooltip/Tooltip';

import EventBus from 'modules/helpers/eventbus';

import './scss/index.scss';

class Navbar extends PureComponent {
  constructor() {
    super();
    this.navbarContainer = createRef();
    this.state = {
      classList: localStorage.getItem('widgetStyle') === 'legacy' ? 'navbar old' : 'navbar new',
      refreshText: '',
      refreshEnabled: localStorage.getItem('refresh'),
      refreshOption: localStorage.getItem('refreshOption') || '',
    };
  }

  setZoom() {
    this.setState({
      zoomFontSize: Number(((localStorage.getItem('zoomNavbar') || 100) / 100) * 1.2) + 'rem',
    });
  }

  updateRefreshText() {
    let refreshText;
    switch (localStorage.getItem('refreshOption')) {
      case 'background':
        refreshText = variables.getMessage('modals.main.settings.sections.background.title');
        break;
      case 'quote':
        refreshText = variables.getMessage('modals.main.settings.sections.quote.title');
        break;
      case 'quotebackground':
        refreshText =
          variables.getMessage('modals.main.settings.sections.quote.title') +
          ' ' +
          variables.getMessage('modals.main.settings.sections.background.title');
        break;
      default:
        refreshText = variables.getMessage(
          'modals.main.settings.sections.appearance.navbar.refresh_options.page',
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
          {localStorage.getItem('notesEnabled') === 'true' ? (
            <Notes fontSize={this.state.zoomFontSize} />
          ) : null}
          {localStorage.getItem('todoEnabled') === 'true' ? (
            <Todo fontSize={this.state.zoomFontSize} />
          ) : null}

          {this.refreshEnabled !== 'false' ? (
            <Tooltip
              title={variables.getMessage('widgets.navbar.tooltips.refresh')}
              subtitle={this.state.refreshText}
            >
              <button
                onClick={() => this.refresh()}
                style={{ fontSize: this.state.zoomFontSize }}
                aria-label={variables.getMessage('widgets.navbar.tooltips.refresh')}
              >
                <MdRefresh className="refreshicon topicons" />
              </button>
            </Tooltip>
          ) : null}
          <Tooltip
            title={variables.getMessage('modals.main.navbar.settings', {
              type: variables.getMessage(
                'modals.main.navbar.tooltips.refresh_' + this.refreshValue,
              ),
            })}
          >
            <button
              onClick={() => this.props.openModal('mainModal')}
              style={{ fontSize: this.state.zoomFontSize }}
              aria-label={variables.getMessage('modals.main.navbar.settings', {
                type: variables.getMessage(
                  'modals.main.navbar.tooltips.refresh_' + this.refreshValue,
                ),
              })}
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

Navbar.propTypes = {
  openModal: PropTypes.func,
};

export default Navbar;
