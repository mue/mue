import { Suspense, lazy, memo } from 'react';
const Analog = lazy(() => import('react-clock'));

function ClockSkeleton() {
  if (localStorage.getItem('timeType') === 'analogue') {
    return (
      <Suspense fallback={<></>}>
        <div className="clockBackground">
          <Analog
            className="analogclock clock-container"
            value={'2022-10-07T17:00:00+00:00'}
            size={50}
          />
        </div>
      </Suspense>
    );
  } else if (localStorage.getItem('timeType') === 'percentageComplete') {
    return <span className="new-clock clock-container clockSkeleton">68%</span>;
  } else if (localStorage.getItem('timeType') === 'verticalClock') {
    return (
      <span className="new-clock clock-container" style={{ fontSize: '30px' }}>
        <div className="hour">10</div>
        <div className="minute">23</div>
      </span>
    );
  } else {
    return <span className="new-clock clock-container clockSkeleton">10:24</span>;
  }
}

export default memo(ClockSkeleton);
