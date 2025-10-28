import variables from 'config/variables';
import { MdRefresh, MdClose } from 'react-icons/md';

const ReminderInfo = ({ isVisible, onHide }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="reminder-info">
      <div className="shareHeader">
        <span className="title">{variables.getMessage('modals.main.settings.reminder.title')}</span>
        <span className="closeModal" onClick={onHide}>
          <MdClose />
        </span>
      </div>
      <span className="subtitle">
        {variables.getMessage('modals.main.settings.reminder.message')}
      </span>
      <button onClick={() => window.location.reload()}>
        <MdRefresh />
        {variables.getMessage('modals.main.error_boundary.refresh')}
      </button>
    </div>
  );
};

export default ReminderInfo;
