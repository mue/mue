import { memo } from 'react';
import variables from 'config/variables';
import './preview.scss';

function Preview(props) {
  const setup = () => {
    localStorage.setItem('showWelcome', true);
    localStorage.setItem('welcomePreview', false);
    window.location.reload();
  };

  return (
    <div className="preview-mode">
      <span className="title">{variables.getMessage('modals.main.settings.reminder.title')}</span>
      <span className="subtitle">{variables.getMessage('modals.welcome.preview.description')}</span>
      <button onClick={() => setup()}>
        {variables.getMessage('modals.welcome.preview.continue')}
      </button>
    </div>
  );
}

export default memo(Preview);
