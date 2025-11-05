// TODO: make it work with pins or on click or smth
import variables from 'config/variables';
import { memo, useState, useEffect, useCallback } from 'react';

import { MdPlaylistRemove, MdOutlineApps } from 'react-icons/md';
import { Tooltip } from 'components/Elements';

import { shift, useFloating } from '@floating-ui/react-dom';
import EventBus from 'utils/eventbus';
import { useRenderCounter } from 'utils/performance';

const Apps = ({ appsRef, floatRef, position, xPosition, yPosition }) => {
  useRenderCounter('Apps');

  const [apps, setApps] = useState(JSON.parse(localStorage.getItem('applinks')));
  const [visibility, setVisibility] = useState(
    localStorage.getItem('appsPinned') === 'true' ? 'visible' : 'hidden',
  );
  const [marginLeft, setMarginLeft] = useState(
    localStorage.getItem('refresh') === 'false' ? '-200px' : '-130px',
  );
  const [showApps, setShowApps] = useState(localStorage.getItem('appsPinned') === 'true');
  const [zoomFontSize, setZoomFontSize] = useState('1.2rem');

  const setZoom = useCallback(() => {
    setZoomFontSize(Number(((localStorage.getItem('zoomNavbar') || 100) / 100) * 1.2) + 'rem');
  }, []);

  useEffect(() => {
    const handleRefresh = (data) => {
      if (data === 'navbar') {
        setApps(JSON.parse(localStorage.getItem('applinks')));
        try {
          setZoom();
        } catch {
          // Ignore errors
        }
      }
    };

    setZoom();

    EventBus.on('refresh', handleRefresh);
    return () => {
      EventBus.off('refresh', handleRefresh);
    };
  }, [setZoom]);

  const handleShowApps = useCallback(() => {
    setShowApps(true);
  }, []);

  const handleHideApps = useCallback(() => {
    setShowApps(localStorage.getItem('AppsPinned') === 'true');
  }, []);

  const appsInfo = apps;

  return (
    <div className="notes" onMouseLeave={handleHideApps} onFocus={handleShowApps}>
      <button
        className="navbarButton"
        onMouseEnter={handleShowApps}
        onFocus={handleHideApps}
        onBlur={handleShowApps}
        ref={appsRef}
        style={{ fontSize: zoomFontSize }}
      >
        <MdOutlineApps className="topicons" />
      </button>
      {showApps && (
        <span
          className="notesContainer"
          ref={floatRef}
          style={{
            position: position,
            top: yPosition ?? '44px',
            left: xPosition ?? '',
          }}
        >
          <div className="flexTodo">
            <div className="topBarNotes" style={{ display: 'flex' }}>
              <MdOutlineApps />
              <span>{variables.getMessage('widgets.navbar.apps.title')}</span>
            </div>
          </div>
          {appsInfo.length > 0 ? (
            <div className="appsShortcutContainer">
              {appsInfo.map((info, i) => (
                <Tooltip
                  title={info.name.split(' ')[0]}
                  subtitle={info.name.split(' ').slice(1).join(' ')}
                  key={i}
                >
                  <a href={info.url} className="appsIcon">
                    <img
                      src={
                        info.icon === ''
                          ? `https://icon.horse/icon/ ${info.url.replace('https://', '').replace('http://', '')}`
                          : info.icon
                      }
                      width="40px"
                      height="40px"
                      alt="Google"
                    />
                    <span>{info.name}</span>
                  </a>
                </Tooltip>
              ))}
            </div>
          ) : (
            <div className="todosEmpty">
              <div className="emptyNewMessage">
                <MdPlaylistRemove />
                <span className="title">
                  {variables.language.getMessage(
                    variables.languagecode,
                    'widgets.navbar.apps.no_apps',
                  )}
                </span>
              </div>
            </div>
          )}
        </span>
      )}
    </div>
  );
};

function AppsWrapper() {
  const [reference, setReference] = useState(null);

  const { x, y, refs, strategy } = useFloating({
    placement: 'bottom',
    middleware: [shift()],
    elements: { reference },
  });

  return (
    <Apps
      appsRef={setReference}
      floatRef={refs.setFloating}
      position={strategy}
      xPosition={x}
      yPosition={y}
    />
  );
}

const MemoizedAppsWrapper = memo(AppsWrapper);
export { MemoizedAppsWrapper as default, MemoizedAppsWrapper as Apps };
