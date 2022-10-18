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
      refreshText: '',
    };
  }

  setZoom() {
    this.setState({
      zoomFontSize: Number(((localStorage.getItem('zoomNavbar') || 100) / 100) * 1.2) + 'rem',
    });
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

    if (localStorage.getItem('refreshOption') === 'background') {
      this.setState({
        refreshText: variables.getMessage('modals.main.settings.sections.background.title'),
      });
    } else if (localStorage.getItem('refreshOption') === 'quote') {
      this.setState({
        refreshText: variables.getMessage('modals.main.settings.sections.quote.title'),
      });
    } else if (localStorage.getItem('refreshOption') === 'quotebackground') {
      this.setState({
        refreshText:
          variables.getMessage('modals.main.settings.sections.quote.title') +
          ' ' +
          variables.getMessage('modals.main.settings.sections.background.title'),
      });
    } else {
      this.setState({
        refreshText: variables.getMessage(
          'modals.main.settings.sections.appearance.navbar.refresh_options.page',
        ),
      });
    }

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
      <div className="navbar-container">
        <div className={this.state.classList}>
          {localStorage.getItem('view') === 'true' && backgroundEnabled ? (
            <Maximise fontSize={this.state.zoomFontSize} />
          ) : null}
          {localStorage.getItem('notesEnabled') === 'true' ? (
            <Notes fontSize={this.state.zoomFontSize} />
          ) : null}
          {localStorage.getItem('todo') === 'true' ? (
            <Todo fontSize={this.state.zoomFontSize} />
          ) : null}

          {this.refreshEnabled !== 'false' ? (
            <Tooltip
              title={variables.getMessage('widgets.navbar.tooltips.refresh')}
              subtitle={this.state.refreshText}
            >
              <button onClick={() => this.refresh()} style={{ fontSize: this.state.zoomFontSize }}>
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
