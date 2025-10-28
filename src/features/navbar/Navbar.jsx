import variables from 'config/variables';
import { useState, useEffect, useRef } from 'react';

import { MdSettings } from 'react-icons/md';

import { Notes, Todo, Apps, Refresh, Maximise } from './components';
import { Tooltip } from 'components/Elements';

import EventBus from 'utils/eventbus';

import './scss/index.scss';

const Navbar = ({ openModal }) => {
  const navbarContainer = useRef();
  const [classList] = useState(
    localStorage.getItem('widgetStyle') === 'legacy' ? 'navbar old' : 'navbar new',
  );
  const [refreshText, setRefreshText] = useState('');
  const [refreshEnabled, setRefreshEnabled] = useState(localStorage.getItem('refresh'));
  const [refreshOption, setRefreshOption] = useState(localStorage.getItem('refreshOption') || '');
  const [appsOpen, setAppsOpen] = useState(false);
  const [zoomFontSize, setZoomFontSize] = useState('1.2rem');

  const setZoom = () => {
    setZoomFontSize(Number(((localStorage.getItem('zoomNavbar') || 100) / 100) * 1.2) + 'rem');
  };

  const updateRefreshText = () => {
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

    setRefreshText(refreshText);
  };

  useEffect(() => {
    const handleRefresh = (data) => {
      if (data === 'navbar' || data === 'background') {
        setRefreshEnabled(localStorage.getItem('refresh'));
        setRefreshOption(localStorage.getItem('refreshOption'));

        try {
          updateRefreshText();
          setZoom();
        } catch {
          // Ignore errors
        }
      }
    };

    updateRefreshText();
    setZoom();

    EventBus.on('refresh', handleRefresh);
    return () => {
      EventBus.off('refresh');
    };
  }, []);

  const refresh = () => {
    switch (refreshOption) {
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
  };

  const backgroundEnabled = localStorage.getItem('background') === 'true';

  const navbar = (
    <div className="navbar-container">
      <div className={classList}>
        {localStorage.getItem('view') === 'true' && backgroundEnabled ? (
          <Maximise fontSize={zoomFontSize} />
        ) : null}
        {localStorage.getItem('notesEnabled') === 'true' && <Notes fontSize={zoomFontSize} />}
        {localStorage.getItem('todoEnabled') === 'true' && <Todo fontSize={zoomFontSize} />}
        {localStorage.getItem('appsEnabled') === 'true' && <Apps fontSize={zoomFontSize} />}

        {refreshEnabled !== 'false' && <Refresh fontSize={zoomFontSize} />}

        <Tooltip
          title={variables.getMessage('modals.main.navbar.settings', {
            type: variables.getMessage('modals.main.navbar.tooltips.refresh_' + refreshOption),
          })}
        >
          <button
            className="navbarButton"
            onClick={() => openModal('mainModal')}
            style={{ fontSize: zoomFontSize }}
            aria-label={variables.getMessage('modals.main.navbar.settings', {
              type: variables.getMessage('modals.main.navbar.tooltips.refresh_' + refreshOption),
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
};

export { Navbar as default, Navbar };
