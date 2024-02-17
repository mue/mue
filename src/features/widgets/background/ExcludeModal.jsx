import variables from 'config/variables';
import { memo } from 'react';
import EventBus from 'modules/helpers/eventbus';
import { Tooltip } from 'components/Elements';

import { MdClose, MdDone } from 'react-icons/md';

function ExcludeModal({ modalClose, info }) {
  const excludeImage = async () => {
    let backgroundExclude = JSON.parse(localStorage.getItem('backgroundExclude'));
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
        <button className="textButton" onClick={modalClose}>
          <MdClose />
          {variables.getMessage('modals.main.settings.sections.advanced.reset_modal.cancel')}
        </button>
        <button onClick={() => excludeImage()}>
          <MdDone />
          {variables.getMessage('widgets.background.confirm')}
        </button>
      </div>
    </div>
  );
}

export default memo(ExcludeModal);
