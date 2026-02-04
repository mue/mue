import { useT } from 'contexts';
import { MdRefresh, MdClose } from 'react-icons/md';

const ReminderInfo = ({ isVisible, onHide }) => {
  const t = useT();
  if (!isVisible) {
    return null;
  }

  return (
    <div className="reminder-info">
      <div className="shareHeader">
        <span className="title">{t('modals.main.settings.reminder.title')}</span>
        <span className="closeModal" onClick={onHide}>
          <MdClose />
        </span>
      </div>
      <span className="subtitle">{t('modals.main.settings.reminder.message')}</span>
      <button onClick={() => window.location.reload()}>
        <MdRefresh />
        {t('modals.main.error_boundary.refresh')}
      </button>
    </div>
  );
};

export default ReminderInfo;
