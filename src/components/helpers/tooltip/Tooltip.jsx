import './tooltip.scss';

export default function Tooltip(props) {
  return (
    <div className='tooltip'>
      {props.children}
      <span className='tooltipTitle'>{props.title}</span>
    </div>
  );
}
