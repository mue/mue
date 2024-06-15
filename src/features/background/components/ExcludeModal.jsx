import variables from 'config/variables';
import { memo } from 'react';
import EventBus from 'utils/eventbus';
import { Tooltip, Button } from 'components/Elements';

import { MdClose, MdDone } from 'react-icons/md';
import defaults from '../options/default';

function ExcludeModal({ modalClose, info }) {
  const excludeImage = async () => {
    let backgroundExclude = JSON.parse(localStorage.getItem('backgroundExclude')) || defaults.backgroundExclude;
    backgroundExclude.push(info.pun);
    backgroundExclude = JSON.stringify(backgroundExclude);
    localStorage.setItem('backgroundExclude', backgroundExclude);
    EventBus.emit('refresh', 'background');
    modalClose();
  };

  return (
    <div className="smallModal">
      <div className="shareHeader">
        <span className="title">
          {variables.getMessage('modals.main.settings.sections.advanced.reset_modal.title')}
        </span>
        <Tooltip
          title={variables.getMessage('modals.main.settings.sections.advanced.reset_modal.cancel')}
        >
          <div className="close" onClick={modalClose}>
            <MdClose />
          </div>
        </Tooltip>
      </div>
      <span className="subtitle">
        {variables.getMessage('widgets.background.exclude_confirm', { category: info.category })}
      </span>
      <div className="resetFooter">
        <Button
          type="secondary"
          onClick={modalClose}
          icon={<MdClose />}
          label={variables.getMessage('modals.main.settings.sections.advanced.reset_modal.cancel')}
        />
        <Button
          type="settings"
          onClick={() => excludeImage()}
          icon={<MdDone />}
          label={variables.getMessage('widgets.background.confirm')}
        />
      </div>
    </div>
  );
}

export default memo(ExcludeModal);
