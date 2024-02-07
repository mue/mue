import { MdOutlineKeyboardArrowRight } from 'react-icons/md';

export default function Section({ title, subtitle, icon, onClick }) {
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
        <MdOutlineKeyboardArrowRight />
      </div>
    </div>
  );
}
