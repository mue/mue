import variables from 'modules/variables';
import { PureComponent, memo } from 'react';
import PropTypes from 'prop-types';

import { MdContentCopy, MdAssignment, MdPushPin, MdDownload } from 'react-icons/md';
import { useFloating, shift } from '@floating-ui/react-dom';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { toast } from 'react-toastify';
import Tooltip from 'components/helpers/tooltip/Tooltip';
import { saveFile } from 'modules/helpers/settings/modals';
import EventBus from 'modules/helpers/eventbus';

class Notes extends PureComponent {
  constructor() {
    super();
    this.state = {
      notes: localStorage.getItem('notes') || '',
      visibility: localStorage.getItem('notesPinned') === 'true' ? 'visible' : 'hidden',
      showNotes: localStorage.getItem('notesPinned') === 'true' ? true : false,
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

  setNotes = (e) => {
    localStorage.setItem('notes', e.target.value);
    this.setState({
      notes: e.target.value,
    });
  };

  showNotes() {
    this.setState({
      showNotes: true,
    });
  }

  hideNotes() {
    this.setState({
      showNotes: localStorage.getItem('notesPinned') === 'true',
    });
  }

  pin() {
    variables.stats.postEvent('feature', 'Notes pin');
    const notesPinned = localStorage.getItem('notesPinned') === 'true';
    localStorage.setItem('notesPinned', !notesPinned);
    this.setState({
      showNotes: !notesPinned,
    });
  }

  copy() {
    variables.stats.postEvent('feature', 'Notes copied');
    navigator.clipboard.writeText(this.state.notes);
    toast(variables.getMessage('toasts.notes'));
  }

  download() {
    const notes = localStorage.getItem('notes');
    if (!notes || notes === '') {
      return;
    }

    variables.stats.postEvent('feature', 'Notes download');
    saveFile(this.state.notes, 'mue-notes.txt', 'text/plain');
  }

  render() {
    return (
      <div className="notes" onMouseLeave={() => this.hideNotes()} onFocus={() => this.showNotes()}>
        <button
          className="first"
          onMouseEnter={() => this.showNotes()}
          onFocus={() => this.showNotes()}
          onBlur={() => this.hideNotes()}
          ref={this.props.notesRef}
          style={{ fontSize: this.state.zoomFontSize }}
          aria-label={variables.getMessage('widgets.navbar.notes.title')}
        >
          <MdAssignment className="topicons" />
        </button>
        {this.state.showNotes && (
          <span
            className="notesContainer"
            ref={this.props.floatRef}
            style={{
              position: this.props.position,
              top: this.props.yPosition ?? '44',
              left: this.props.xPosition ?? '',
            }}
          >
            <div className="flexNotes">
              <div className="topBarNotes" style={{ display: 'flex' }}>
                <MdAssignment />
                <span>{variables.getMessage('widgets.navbar.notes.title')}</span>
              </div>
              <div className="notes-buttons">
                <Tooltip title={variables.getMessage('widgets.navbar.todo.pin')}>
                  <button onClick={() => this.pin()}>
                    <MdPushPin />
                  </button>
                </Tooltip>
                <Tooltip title={variables.getMessage('widgets.quote.copy')}>
                  <button onClick={() => this.copy()} disabled={this.state.notes === ''}>
                    <MdContentCopy />
                  </button>
                </Tooltip>
                <Tooltip title={variables.getMessage('widgets.background.download')}>
                  <button onClick={() => this.download()} disabled={this.state.notes === ''}>
                    <MdDownload />
                  </button>
                </Tooltip>
              </div>
              <TextareaAutosize
                placeholder={variables.getMessage('widgets.navbar.notes.placeholder')}
                value={this.state.notes}
                onChange={this.setNotes}
                minRows={5}
                maxLength={10000}
              />
            </div>
          </span>
        )}
      </div>
    );
  }
}

function NotesWrapper() {
  const { x, y, reference, floating, strategy } = useFloating({
    placement: 'bottom',
    middleware: [shift()],
  });

  return (
    <Notes
      notesRef={reference}
      floatRef={floating}
      position={strategy}
      xPosition={x}
      yPosition={y}
    />
  );
}

Notes.propTypes = {
  notesRef: PropTypes.object,
  floatRef: PropTypes.object,
  position: PropTypes.string,
  xPosition: PropTypes.number,
  yPosition: PropTypes.number,
};

export default memo(NotesWrapper);
