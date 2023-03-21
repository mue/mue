import { memo } from 'react';
import PropTypes from 'prop-types';

function ProgressBar({ count, currentTab, switchTab }) {
  return (
    <div className="progressbar">
      {count.map((num) => {
        let className = 'step';

        const index = count.indexOf(num);
        if (index === currentTab) {
          className = 'step active';
        }

        return <div className={className} key={index} onClick={() => switchTab(index)} />;
      })}
    </div>
  );
}

ProgressBar.propTypes = {
  count: PropTypes.arrayOf(PropTypes.number).isRequired,
  currentTab: PropTypes.number.isRequired,
  switchTab: PropTypes.func.isRequired,
};

export default memo(ProgressBar);
