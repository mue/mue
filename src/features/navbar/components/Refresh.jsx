import { useState, useEffect } from 'react';
import variables from 'config/variables';
import { MdRefresh } from 'react-icons/md';
import { Tooltip } from 'components/Elements';
import EventBus from 'utils/eventbus';

function Refresh() {
  const [refreshText, setRefreshText] = useState('');
  const [refreshOption, setRefreshOption] = useState(localStorage.getItem('refreshOption') || '');

  useEffect(() => {
    EventBus.on('refresh', (data) => {
      if (data === 'navbar' || data === 'background') {
        setRefreshOption(localStorage.getItem('refreshOption'));
        updateRefreshText();
      }
    });

    updateRefreshText();
  }, []);

  function updateRefreshText() {
    let text;
    switch (localStorage.getItem('refreshOption')) {
      case 'background':
        text = variables.getMessage('modals.main.settings.sections.background.title');
        break;
      case 'quote':
        text = variables.getMessage('modals.main.settings.sections.quote.title');
        break;
      case 'quotebackground':
        text =
          variables.getMessage('modals.main.settings.sections.quote.title') +
          ' ' +
          variables.getMessage('modals.main.settings.sections.background.title');
        break;
      default:
        text = variables.getMessage(
          'modals.main.settings.sections.appearance.navbar.refresh_options.page',
        );
        break;
    }

    setRefreshText(text);
  }

  function refresh() {
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
  }

  return (
    <Tooltip title={variables.getMessage('widgets.navbar.tooltips.refresh')} subtitle={refreshText}>
      <button
        onClick={refresh}
        aria-label={variables.getMessage('widgets.navbar.tooltips.refresh')}
      >
        <MdRefresh className="refreshicon topicons" />
      </button>
    </Tooltip>
  );
}

export { Refresh as default, Refresh };
