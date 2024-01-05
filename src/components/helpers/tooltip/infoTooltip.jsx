import variables from 'modules/variables';
import { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { useFloating, flip, offset, shift } from '@floating-ui/react-dom';
import { MdClose, MdInfo, MdOpenInNew } from 'react-icons/md';
import Tooltip from './Tooltip';

import './tooltip.scss';

function InfoTooltip({ title, style, placement, subtitle }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [reference, setReference] = useState(null);
  const { x, y, refs, strategy } = useFloating({
    placement: placement || 'top-start',
    middleware: [flip(), offset(10), shift()],
    elements: {
      reference,
    },
  });

  return (
    <div className="infoTooltip" style={style} ref={setReference}>
      <MdInfo onClick={() => setShowTooltip(true)} />
      {showTooltip && (
        <div
          ref={refs.setFloating}
          style={{
            position: strategy,
            top: y ?? '',
            left: x ?? '',
          }}
          className="infoTooltipTitle"
        >
          <div className="tooltipHeader">
            <span className="title">{title}</span>
            <Tooltip title={variables.getMessage('modals.welcome.buttons.close')}>
              <div className="close" onClick={() => setShowTooltip(false)}>
                <MdClose />
              </div>
            </Tooltip>
          </div>
          <span className="subtitle">{subtitle}</span>
          <span className="link">
            {variables.getMessage('modals.main.settings.open_knowledgebase')} <MdOpenInNew />
          </span>
        </div>
      )}
    </div>
  );
}

InfoTooltip.propTypes = {
  title: PropTypes.string.isRequired,
  style: PropTypes.object,
  placement: PropTypes.string,
  subtitle: PropTypes.string.isRequired,
};

export default memo(InfoTooltip);
