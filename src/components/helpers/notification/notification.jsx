import variables from 'modules/variables';
import './preview.scss';

export default function Notification(props) {
  return (
    <div className="preview-mode">
      <span className="title">{variables.getMessage('modals.main.settings.reminder.title')}</span>
      <span className="subtitle">{variables.getMessage('modals.welcome.preview.description')}</span>
      <button onClick={() => props.setup()}>
        {variables.getMessage('modals.welcome.preview.continue')}
      </button>
    </div>
  );
}
