import variables from 'modules/variables';
import { useState } from 'react';
import { useFloating, flip, offset, shift } from '@floating-ui/react-dom';
import { MdClose, MdInfo, MdOpenInNew } from 'react-icons/md';
import Tooltip from './Tooltip';

import './tooltip.scss';

export default function InfoTooltip({ title, style, placement, subtitle }) {
  const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

  const [showTooltip, setShowTooltip] = useState(false);
  const { x, y, reference, floating, strategy } = useFloating({
    placement: placement || 'top-start',
    middleware: [flip(), offset(10), shift()],
  });

  return (
    <div className="infoTooltip" style={style} ref={reference}>
      <MdInfo onClick={() => setShowTooltip(true)} />
      {showTooltip && (
        <div
          ref={floating}
          style={{
            position: strategy,
            top: y ?? '',
            left: x ?? '',
          }}
          className="infoTooltipTitle"
        >
          <div className="tooltipHeader">
            <span className="title">{title}</span>
            <Tooltip title={getMessage('modals.welcome.buttons.close')}>
              <div className="close" onClick={() => setShowTooltip(false)}>
                <MdClose />
              </div>
            </Tooltip>
          </div>
          <span className="subtitle">{subtitle}</span>
          <span className="link">
            {getMessage('modals.main.settings.open_knowledgebase')} <MdOpenInNew />
          </span>
        </div>
      )}
    </div>
  );
}
