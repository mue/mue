import variables from 'config/variables';
import { memo, useState, useEffect, useCallback } from 'react';

import { MdContentCopy, MdAssignment, MdPushPin, MdDownload } from 'react-icons/md';
import { useFloating, shift } from '@floating-ui/react-dom';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { toast } from 'react-toastify';
import { Tooltip } from 'components/Elements';

import { saveFile } from 'utils/saveFile';
import EventBus from 'utils/eventbus';
import { useRenderCounter } from 'utils/performance';

const Notes = ({ notesRef, floatRef, position, xPosition, yPosition }) => {
  useRenderCounter('Notes');

  const [notes, setNotes] = useState(localStorage.getItem('notes') || '');
  const [showNotes, setShowNotes] = useState(localStorage.getItem('notesPinned') === 'true');
  const [zoomFontSize, setZoomFontSize] = useState('1.2rem');

  useEffect(() => {
    const handleRefresh = (data) => {
      if (data === 'navbar') {
        setZoomFontSize(Number(((localStorage.getItem('zoomNavbar') || 100) / 100) * 1.2) + 'rem');
      }
    };

    setZoomFontSize(Number(((localStorage.getItem('zoomNavbar') || 100) / 100) * 1.2) + 'rem');

    EventBus.on('refresh', handleRefresh);
    return () => {
      EventBus.off('refresh');
    };
  }, []);

  const handleSetNotes = useCallback((e) => {
    localStorage.setItem('notes', e.target.value);
    setNotes(e.target.value);
  }, []);

  const handleShowNotes = useCallback(() => {
    setShowNotes(true);
  }, []);

  const handleHideNotes = useCallback(() => {
    setShowNotes(localStorage.getItem('notesPinned') === 'true');
  }, []);

  const handlePin = useCallback(() => {
    variables.stats.postEvent('feature', 'Notes pin');
    const notesPinned = localStorage.getItem('notesPinned') === 'true';
    localStorage.setItem('notesPinned', !notesPinned);
    setShowNotes(!notesPinned);
  }, []);

  const handleCopy = useCallback(() => {
    variables.stats.postEvent('feature', 'Notes copied');
    navigator.clipboard.writeText(notes);
    toast(variables.getMessage('toasts.notes'));
  }, [notes]);

  const handleDownload = useCallback(() => {
    if (!notes || notes === '') {
      return;
    }

    variables.stats.postEvent('feature', 'Notes download');
    saveFile(notes, 'mue-notes.txt', 'text/plain');
  }, [notes]);

  return (
    <div className="notes" onMouseLeave={handleHideNotes} onFocus={handleShowNotes}>
      <button
        className="navbarButton"
        onMouseEnter={handleShowNotes}
        onFocus={handleShowNotes}
        onBlur={handleHideNotes}
        ref={notesRef}
        style={{ fontSize: zoomFontSize }}
        aria-label={variables.getMessage('widgets.navbar.notes.title')}
      >
        <MdAssignment className="topicons" />
      </button>
      {showNotes && (
        <span
          className="notesContainer"
          ref={floatRef}
          style={{
            position: position,
            top: yPosition ?? '44',
            left: xPosition ?? '',
          }}
        >
          <div className="flexNotes">
            <div className="topBarNotes" style={{ display: 'flex' }}>
              <MdAssignment />
              <span>{variables.getMessage('widgets.navbar.notes.title')}</span>
            </div>
            <div className="notes-buttons">
              <Tooltip title={variables.getMessage('widgets.navbar.todo.pin')}>
                <button onClick={handlePin}>
                  <MdPushPin />
                </button>
              </Tooltip>
              <Tooltip title={variables.getMessage('widgets.quote.copy')}>
                <button onClick={handleCopy} disabled={notes === ''}>
                  <MdContentCopy />
                </button>
              </Tooltip>
              <Tooltip title={variables.getMessage('widgets.background.download')}>
                <button onClick={handleDownload} disabled={notes === ''}>
                  <MdDownload />
                </button>
              </Tooltip>
            </div>
            <TextareaAutosize
              placeholder={variables.getMessage('widgets.navbar.notes.placeholder')}
              value={notes}
              onChange={handleSetNotes}
              minRows={5}
              maxLength={10000}
            />
          </div>
        </span>
      )}
    </div>
  );
};

function NotesWrapper() {
  const [reference, setReference] = useState(null);

  const { x, y, refs, strategy } = useFloating({
    placement: 'bottom',
    middleware: [shift()],
    elements: { reference },
  });

  return (
    <Notes
      notesRef={setReference}
      floatRef={refs.setFloating}
      position={strategy}
      xPosition={x}
      yPosition={y}
    />
  );
}

const MemoizedNotesWrapper = memo(NotesWrapper);
export { MemoizedNotesWrapper as default, MemoizedNotesWrapper as Notes };
