import './tooltip.scss';

export default function Tooltip({ children, title }) {
  return (
    <div className='tooltip'>
      {children}
      <span className='tooltipTitle'>{title}</span>
    </div>
  );
}
