export default function ProgressBar({ count, currentTab, switchTab }) {
  return (
    <div className='progressbar'>
      {count.map((num) => {
        let className = 'step';

        const index = count.indexOf(num);
        if (index === currentTab) {
          className = 'step active';
        }

        return <div className={className} key={index} onClick={() => switchTab(index)}></div>;
      })}
    </div>
  );
}
