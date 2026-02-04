import { useState, memo, useRef, useId } from 'react';
import { useFloating, flip, offset, shift } from '@floating-ui/react-dom';
import './tooltip.scss';

function Tooltip({ children, title, style, placement, subtitle }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [reference, setReference] = useState(null);
  const tooltipId = useId();
  const closeTimeout = useRef(null);

  const {
    x,
    y,
    refs,
    strategy,
    placement: computedPlacement,
  } = useFloating({
    placement: placement || 'bottom',
    middleware: [flip(), offset(15), shift()],
    elements: {
      reference,
    },
  });

  const { setFloating } = refs;

  const handleMouseEnter = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setIsClosing(false);
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setIsClosing(true);
    closeTimeout.current = setTimeout(() => {
      setShowTooltip(false);
      setIsClosing(false);
    }, 200);
  };

  const handleFocus = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setIsClosing(false);
    setShowTooltip(true);
  };

  const handleBlur = () => {
    setIsClosing(true);
    closeTimeout.current = setTimeout(() => {
      setShowTooltip(false);
      setIsClosing(false);
    }, 200);
  };

  const getStatus = () => {
    if (!showTooltip && !isClosing) {
      return 'initial';
    }
    if (isClosing) {
      return 'close';
    }
    return 'open';
  };

  return (
    <>
      <div
        className="tooltip"
        style={style}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={setReference}
        aria-describedby={tooltipId}
      >
        {children}
      </div>
      {(showTooltip || isClosing) && (
        <span
          ref={setFloating}
          style={{
            position: strategy,
            top: y ?? '',
            left: x ?? '',
            display: 'flex',
            flexFlow: 'column',
          }}
          className="tooltipTitle"
          data-status={getStatus()}
          data-placement={computedPlacement}
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
