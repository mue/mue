import React, { forwardRef } from 'react';
import Tooltip from '../../../helpers/tooltip/Tooltip';

const Button = forwardRef(({ icon, label, type, iconPlacement, onClick, active }, ref) => {
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
    case 'collection':
      className = 'btn-collection';
      break;
    default:
      className = 'btn-default';
  }

  if (iconPlacement === 'right') {
    className += ' flowReverse';
  }

  if (active) {
    className += ` ${className}-active`;
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
