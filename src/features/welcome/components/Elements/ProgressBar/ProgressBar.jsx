import { memo } from 'react';

const Step = memo(({ isActive, index, onClick }) => {
  const className = isActive ? 'step active' : 'step';

  return (
    <div className={className} onClick={onClick}>
      <span>{index + 1}</span>
    </div>
  );
});

Step.displayName = 'Step';

function ProgressBar({ numberOfTabs, currentTab, switchTab }) {
  return (
    <div className="progressbar">
      {Array.from({ length: numberOfTabs }, (_, index) => (
        <Step
          key={index}
          isActive={index === currentTab}
          index={index}
          onClick={() => switchTab(index)}
        />
      ))}
    </div>
  );
}

const MemoizedProgressBar = memo(ProgressBar);

export default MemoizedProgressBar;
export { MemoizedProgressBar as ProgressBar };
