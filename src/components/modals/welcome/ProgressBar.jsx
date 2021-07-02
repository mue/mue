export default function ProgressBar(props) {
  return (
    <div className='progressbar'>
      {props.count.map((num) => {
        let className = 'step';

        const index = props.count.indexOf(num);
        if (index === props.currentTab) {
          className = 'step active';
        }

        return <div className={className} key={index} onClick={() => props.switchTab(index)}></div>
      })}
    </div>
  );
}