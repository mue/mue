import { useState, Suspense, lazy } from 'react';
import { useTimeUpdate } from '../hooks/useTimeUpdate';
import { useClockZoom } from '../hooks/useClockZoom';
import { convertTimezone } from 'utils/date';
import defaults from '../options/default';

const Clock = lazy(() => import('react-clock'));

export const AnalogClock = () => {
  const [time, setTime] = useState(new Date());
  const { elementRef, updateZoom } = useClockZoom();

  const updateTime = () => {
    let now = new Date();
    const timezone = localStorage.getItem('timezone');

    if (timezone && timezone !== 'auto') {
      now = convertTimezone(now, timezone);
    }
    setTime(now);
  };

  useTimeUpdate(updateTime);

  const enabled = (setting) => localStorage.getItem(setting) === 'true';
  const zoomClock = Number(localStorage.getItem('zoomClock') || defaults.zoomClock);

  return (
    <Suspense fallback={<></>}>
      <div className={`clockBackground ${enabled('roundClock') ? 'round' : ''}`} ref={elementRef}>
        <Clock
          value={time}
          className="analogclock clock-container"
          size={1.5 * zoomClock}
          renderMinuteMarks={enabled('minuteMarks')}
          renderHourMarks={enabled('hourMarks')}
          renderSecondHand={enabled('secondHand')}
          renderMinuteHand={enabled('minuteHand')}
          renderHourHand={enabled('hourHand')}
        />
      </div>
    </Suspense>
  );
};
