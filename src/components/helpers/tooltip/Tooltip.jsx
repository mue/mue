import { useState } from 'react';
import { useFloating, flip, offset, shift } from '@floating-ui/react-dom';
import './tooltip.scss';

export default function Tooltip({ children, title, style, placement }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { x, y, reference, floating, strategy } = useFloating({
    placement: placement || 'bottom',
    middleware: [flip(), offset(15), shift()],
  });

  return (
    <div
      className="tooltip"
      style={style}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      ref={reference}
    >
      {children}
      {showTooltip && (
        <span
          ref={floating}
          style={{
            position: strategy,
            top: y ?? '',
            left: x ?? '',
          }}
          className="tooltipTitle"
        >
          {title}
        </span>
      )}
    </div>
  );
}
