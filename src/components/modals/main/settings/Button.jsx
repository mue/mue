import React, { forwardRef } from 'react';
import Tooltip from '../../../helpers/tooltip/Tooltip';

const Button = forwardRef(({ icon, label, type, iconPlacement, onClick, children }, ref) => {
  let className;

  switch (type) {
    case 'settings':
      className = 'btn-settings';
      break;
    case 'icon':
      className = 'btn-icon';
      break;
    case 'navigation':
      className = 'btn-navigation';
      break;
    default:
      className = 'btn-default';
  }

  if (iconPlacement === 'right') {
    className += ' flowReverse';
  }

  const button = (
    <button className={className} onClick={onClick} ref={ref}>
      {icon}
      {label}
    </button>
  );

  return type === 'icon' ? <Tooltip>{button}</Tooltip> : button;
});

export default Button;
