import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { useTab } from 'components/Elements/MainModal/backend/TabContext';
import React from 'react';

function Section({ id, title, subtitle, icon, onClick, children }) {
  const { setSubSection } = useTab();

  const handleClick = () => {
    setSubSection(id);
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="moreSettings" onClick={handleClick}>
      <div className="left">
        {icon}
        <div className="content">
          <span className="text-xl font-semibold">{title}</span>
          <span className="text-neutral-800 dark:text-neutral-300 ">{subtitle}</span>
        </div>
      </div>
      <div className="action">
        {React.Children.count(children) === 0 ? <MdOutlineKeyboardArrowRight /> : children}
      </div>
    </div>
  );
}

export { Section as default, Section };
