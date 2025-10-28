import { MdOutlineKeyboardArrowRight } from 'react-icons/md';

const NavigationCard = ({ icon: Icon, title, subtitle, onClick, action }) => {
  return (
    <div className="moreSettings" onClick={onClick}>
      <div className="left">
        <Icon />
        <div className="content">
          <span className="title">{title}</span>
          <span className="subtitle">{subtitle}</span>
        </div>
      </div>
      <div className="action">
        {action || <MdOutlineKeyboardArrowRight />}
      </div>
    </div>
  );
};

export default NavigationCard;
