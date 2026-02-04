import { useState, useEffect } from 'react';
import EventBus from 'utils/eventbus';
import './customwidgets.scss';

const CenteredCustomWidgets = () => {
  const [widgets, setWidgets] = useState([]);

  useEffect(() => {
    const loadWidgets = () => {
      const stored = JSON.parse(localStorage.getItem('customWidgets') || '[]');
      setWidgets(stored);
    };

    loadWidgets();

    const handleRefresh = () => {
      loadWidgets();
    };

    EventBus.on('refresh-widgets', handleRefresh);
    window.addEventListener('storage', handleRefresh);

    return () => {
      EventBus.off('refresh-widgets', handleRefresh);
      window.removeEventListener('storage', handleRefresh);
    };
  }, []);

  const centerWidgets = widgets.filter((w) => w.position === 'center');

  if (centerWidgets.length === 0) {
    return null;
  }

  return (
    <>
      {centerWidgets.map((widget) => (
        <div
          key={`${widget.key}-${widget.position}`}
          id={widget.id || widget.key}
          className={`custom-widget-centered${widget.renderAbove ? ' custom-widget-overlay' : ''}`}
          title={widget.name}
        >
          <iframe
            src={widget.url}
            title={widget.name}
            frameBorder="0"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      ))}
    </>
  );
};

export { CenteredCustomWidgets as default, CenteredCustomWidgets };
