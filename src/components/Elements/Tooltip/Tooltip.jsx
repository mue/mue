import { useState, memo, useRef } from 'react';
import { useFloating, flip, offset, shift } from '@floating-ui/react-dom';
import './tooltip.scss';

function Tooltip({ children, title, style, placement, subtitle }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [reference, setReference] = useState(null);
  const tooltipId = useRef(`tooltip-${Math.random()}`);

  const { x, y, refs, strategy } = useFloating({
    placement: placement || 'bottom',
    middleware: [flip(), offset(15), shift()],
    elements: {
      reference,
    },
  });

  return (
    <>
      <div
        className="tooltip"
        style={style}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        ref={setReference}
        aria-describedby={tooltipId.current}
      >
        {children}
      </div>
      {showTooltip && (
        <span
          ref={refs.setFloating}
          style={{
            position: strategy,
            top: y ?? '',
            left: x ?? '',
            display: 'flex',
            flexFlow: 'column',
          }}
          className="tooltipTitle"
        >
          {title}
          <span style={{ fontSize: '8px' }}>{subtitle}</span>
        </span>
      )}
    </>
  );
}

const MemoizedTooltip = memo(Tooltip);

export { MemoizedTooltip as default, MemoizedTooltip as Tooltip };
