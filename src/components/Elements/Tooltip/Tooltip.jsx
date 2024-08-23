import { useState, memo, useRef } from 'react';
import { useFloating, flip, offset, shift } from '@floating-ui/react-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
      <motion.div
        className="tooltip"
        style={style}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        ref={setReference}
        aria-describedby={tooltipId.current}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
      <AnimatePresence>
        {showTooltip && (
          <motion.span
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: y ?? '',
              left: x ?? '',
              display: 'flex',
              flexFlow: 'column',
            }}
            className="tooltipTitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {title}
            <span style={{ fontSize: '8px' }}>{subtitle}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </>
  );
}

const MemoizedTooltip = memo(Tooltip);

export { MemoizedTooltip as default, MemoizedTooltip as Tooltip };
