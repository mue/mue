import { useState } from 'react';
import { useFloating, flip, offset, shift } from '@floating-ui/react-dom';
import './tooltip.scss';

export default function InfoTooltip({
  children,
  title,
  style,
  placement,
  subtitle,
  linkText,
  linkURL,
}) {
  const [showTooltip, setShowTooltip] = useState(true);
  const { x, y, reference, floating, strategy } = useFloating({
    placement: placement || 'bottom-end',
    middleware: [flip(), offset(15), shift()],
  });

  return (
    <div className="tooltip" style={style} ref={reference}>
      {children}
      {showTooltip && (
        <div
          className="notification"
          ref={floating}
          style={{
            position: strategy,
            top: y ?? '',
            left: x ?? '',
          }}
        >
          <span className="title">{title}</span>
          <span className="subtitle">
            {subtitle}{' '}
            <a className="link" href={linkURL}>
              {linkText}
            </a>
          </span>
          <button onClick={() => setShowTooltip(false)}>Ok, Got it!</button>
        </div>
      )}
    </div>
  );
}
