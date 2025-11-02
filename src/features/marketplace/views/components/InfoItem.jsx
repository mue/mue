const InfoItem = ({ icon, header, text }) => (
  <div className="infoItem">
    {icon}
    <div className="text">
      <span className="header">{header}</span>
      <span>{text}</span>
    </div>
  </div>
);

export default InfoItem;
