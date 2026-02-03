import { useState, useEffect } from 'react';
import { useT } from 'contexts/TranslationContext';
import { MdRefresh } from 'react-icons/md';
import { Tooltip } from 'components/Elements';
import EventBus from 'utils/eventbus';
import variables from 'config/variables';

function Refresh() {
  const t = useT();
  const [refreshText, setRefreshText] = useState('');
  const [refreshOption, setRefreshOption] = useState(localStorage.getItem('refreshOption') || '');

  function updateRefreshText() {
    let text;
    switch (localStorage.getItem('refreshOption')) {
      case 'background':
        text = t('modals.main.settings.sections.background.title');
        break;
      case 'quote':
        text = t('modals.main.settings.sections.quote.title');
        break;
      case 'quotebackground':
        text = new Intl.ListFormat(
          localStorage.getItem('language')?.replace(/_/gm, '-') || 'en-GB',
          {
            style: 'long',
            type: 'conjunction',
          },
        ).format([
          t('modals.main.settings.sections.quote.title'),
          t('modals.main.settings.sections.background.title'),
        ]);
        break;
      default:
        text = t('modals.main.settings.sections.appearance.navbar.refresh_options.page');
        break;
    }

    setRefreshText(text);
  }

  useEffect(() => {
    const handleRefresh = (data) => {
      if (data === 'navbar' || data === 'background' || data === 'language') {
        setRefreshOption(localStorage.getItem('refreshOption'));
        updateRefreshText();
      }
    };

    EventBus.on('refresh', handleRefresh);
    updateRefreshText();

    return () => {
      EventBus.off('refresh', handleRefresh);
    };
  }, [t]);

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
    <Tooltip title={t('widgets.navbar.tooltips.refresh')} subtitle={refreshText}>
      <button
        className="navbarButton"
        onClick={refresh}
        aria-label={t('widgets.navbar.tooltips.refresh')}
      >
        <MdRefresh className="refreshicon topicons" />
      </button>
    </Tooltip>
  );
}

export { Refresh as default, Refresh };
