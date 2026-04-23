import { memo } from 'react';
import { useT } from 'contexts';
import './preview.scss';

function Preview(props) {
  const t = useT();
  return (
    <div className="preview-mode">
      <span className="title">{t('modals.main.settings.reminder.title')}</span>
      <span className="subtitle">{t('modals.welcome.preview.description')}</span>
      <button onClick={() => props.setup()}>{t('modals.welcome.preview.continue')}</button>
    </div>
  );
}

export default memo(Preview);
