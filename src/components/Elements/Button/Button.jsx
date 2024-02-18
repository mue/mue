import React, { forwardRef } from 'react';
import Tooltip from 'components/Elements/Tooltip/Tooltip';

const Button = forwardRef(
  (
    { icon, label, type, iconPlacement, onClick, active, disabled, tooltipTitle, tooltipKey },
    ref,
  ) => {
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
      <button className={className} onClick={onClick} ref={ref} disabled={disabled}>
        {icon}
        {label}
      </button>
    );

    return type === 'icon' ? (
      <Tooltip title={tooltipTitle} key={tooltipKey}>
        {button}
      </Tooltip>
    ) : (
      button
    );
  },
);

export { Button as default, Button };
