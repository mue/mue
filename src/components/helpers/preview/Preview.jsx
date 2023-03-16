import { memo } from 'react';
import PropTypes from 'prop-types';
import variables from 'modules/variables';
import './preview.scss';

function Preview(props) {
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

Preview.propTypes = {
  setup: PropTypes.func.isRequired,
};

export default memo(Preview);
