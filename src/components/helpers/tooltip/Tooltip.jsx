import { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { useFloating, flip, offset, shift } from '@floating-ui/react-dom';
import './tooltip.scss';

function Tooltip({ children, title, style, placement, subtitle }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { x, y, reference, floating, strategy } = useFloating({
    placement: placement || 'bottom',
    middleware: [flip(), offset(15), shift()],
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
        ref={reference}
      >
        {children}
      </div>
      {showTooltip && (
        <span
          ref={floating}
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

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  style: PropTypes.object,
  placement: PropTypes.string,
  subtitle: PropTypes.string.isRequired,
};

export default memo(Tooltip);
