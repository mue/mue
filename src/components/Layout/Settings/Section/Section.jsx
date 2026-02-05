import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import React from 'react';

function Section({ title, subtitle, icon, onClick, children }) {
  return (
    <div className="moreSettings" onClick={onClick}>
      <div className="left">
        {icon}
        <div className="content">
          <span className="title">{title}</span>
          <span className="subtitle">{subtitle}</span>
        </div>
      </div>
      <div className="action">
        {children}
        <MdOutlineKeyboardArrowRight />
      </div>
    </div>
  );
}

export { Section as default, Section };
