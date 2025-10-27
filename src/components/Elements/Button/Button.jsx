import React, { forwardRef } from 'react';
import Tooltip from 'components/Elements/Tooltip/Tooltip';

const Button = forwardRef(
  (
    { icon, label, type, iconPlacement, onClick, active, disabled, tooltipTitle, tooltipKey, href },
    ref,
  ) => {
    let className;

    switch (type) {
      case 'settings':
        className = 'btn-settings';
        break;
      case 'secondary':
        className = 'btn-secondary';
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
      case 'linkIconButton':
        className = 'btn-icon';
        break;
      case 'linkButton':
        className = 'btn-settings';
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

    const linkButton = (
      <a className={className} onClick={onClick} ref={ref} disabled={disabled} href={href}>
        {icon}
        {label}
      </a>
    );

    const linkIconButton = (
      <Tooltip title={tooltipTitle} key={tooltipKey}>
        <a
          className={className}
          onClick={onClick}
          ref={ref}
          disabled={disabled}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {icon}
          {label}
        </a>
      </Tooltip>
    );

    switch (type) {
      case 'linkIconButton':
        return linkIconButton;
      case 'linkButton':
        return linkButton;
      case 'icon':
        return (
          <Tooltip title={tooltipTitle} key={tooltipKey}>
            {button}
          </Tooltip>
        );
      default:
        return button;
    }
  },
);

Button.displayName = 'Button';

export { Button as default, Button };
