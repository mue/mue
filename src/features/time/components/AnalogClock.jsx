import { Suspense, lazy } from 'react';
const Analog = lazy(() => import('react-clock'));

function AnalogClock({ time }) {
  const enabled = (setting) => {
    return localStorage.getItem(setting) === 'true';
  };
  return (
    <Suspense fallback={<></>}>
      <div className={`clockBackground ${enabled('roundClock') ? 'round' : ''}`}>
        <Analog
          className="analogclock clock-container"
          value={time}
          size={1.5 * Number(localStorage.getItem('zoomClock') || 100)}
          renderMinuteMarks={enabled('minuteMarks')}
          renderHourMarks={enabled('hourMarks')}
          renderSecondHand={enabled('secondHand')}
          renderMinuteHand={enabled('minuteHand')}
          renderHourHand={enabled('hourHand')}
        />
      </div>
    </Suspense>
  );
}

export { AnalogClock as default, AnalogClock };
