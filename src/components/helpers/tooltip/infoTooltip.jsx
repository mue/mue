import { useState } from 'react';
import { useFloating, flip, offset, shift } from '@floating-ui/react-dom';
import { MdClose, MdInfo, MdOpenInNew } from 'react-icons/md';
import './tooltip.scss';
import Tooltip from './/Tooltip';

export default function InfoTooltip({ children, title, style, placement, subtitle }) {
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
            <Tooltip title="Close">
              <div className="close" onClick={() => setShowTooltip(false)}>
                <MdClose />
              </div>
            </Tooltip>
          </div>
          <span className="subtitle">{subtitle}</span>
          <span className="link">
            Open Knowledgebase <MdOpenInNew />
          </span>
        </div>
      )}
    </div>
  );
}
