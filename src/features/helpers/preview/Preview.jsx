import { memo } from 'react';
import { MdArrowForwardIos } from 'react-icons/md';
import { Button } from 'components/Elements';
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
      <span className="title">{variables.getMessage('settings:reminder.title')}</span>
      <span className="subtitle">{variables.getMessage('welcome:preview.description')}</span>
      <Button
        type="settings"
        onClick={() => setup()}
        icon={<MdArrowForwardIos />}
        label={variables.getMessage('welcome:preview.continue')}
        iconPlacement={'right'}
      />
    </div>
  );
}

export default memo(Preview);
