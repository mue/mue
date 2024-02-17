// TODO: make it work with pins or on click or smth
import variables from 'modules/variables';
import { PureComponent, memo, useState } from 'react';

import { MdPlaylistRemove, MdOutlineApps } from 'react-icons/md';
import Tooltip from 'features/helpers/tooltip/Tooltip';
import { shift, useFloating } from '@floating-ui/react-dom';
import EventBus from 'modules/helpers/eventbus';

class Apps extends PureComponent {
  constructor() {
    super();
    this.state = {
      apps: JSON.parse(localStorage.getItem('applinks')),
      visibility: localStorage.getItem('appsPinned') === 'true' ? 'visible' : 'hidden',
      marginLeft: localStorage.getItem('refresh') === 'false' ? '-200px' : '-130px',
      showApps: localStorage.getItem('appsPinned') === 'true',
    };
  }

  setZoom() {
    this.setState({
      zoomFontSize: Number(((localStorage.getItem('zoomNavbar') || 100) / 100) * 1.2) + 'rem',
    });
  }

  componentDidMount() {
    EventBus.on('refresh', (data) => {
      if (data === 'navbar') {
        this.forceUpdate();
        try {
          this.setZoom();
        } catch (e) {}
      }
    });

    this.setZoom();
  }

  componentWillUnmount() {
    EventBus.off('refresh');
  }

  showApps() {
    this.setState({
      showApps: true,
    });
  }

  hideApps() {
    this.setState({
      showApps: localStorage.getItem('AppsPinned') === 'true',
    });
  }

  render() {
    const appsInfo = this.state.apps;

    return (
      <div className="notes" onMouseLeave={() => this.hideApps()} onFocus={() => this.showApps()}>
        <button
          className="first"
          onMouseEnter={() => this.showApps()}
          onFocus={() => this.hideApps()}
          onBlur={() => this.showApps()}
          ref={this.props.appsRef}
          style={{ fontSize: this.state.zoomFontSize }}
        >
          <MdOutlineApps className="topicons" />
        </button>
        {this.state.showApps && (
          <span
            className="notesContainer"
            ref={this.props.floatRef}
            style={{
              position: this.props.position,
              top: this.props.yPosition ?? '44px',
              left: this.props.xPosition ?? '',
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
  }
}

function AppsWrapper() {
  const [reference, setReference] = useState(null);

  const { x, y, refs, strategy } = useFloating({
    placement: 'bottom',
    middleware: [shift()],
    elements: {
      reference,
    },
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

export default memo(AppsWrapper);
