import { useState, Suspense, lazy } from 'react';
import { useTimeUpdate } from '../hooks/useTimeUpdate';
import { useClockZoom } from '../hooks/useClockZoom';
import { convertTimezone } from 'utils/date';
import defaults from '../options/default';
import { useTime } from '../context/TimeContext';

const Clock = lazy(() => import('react-clock'));

export const AnalogClock = () => {
  const { currentDate, updateTime } = useTime();
  const { elementRef } = useClockZoom();

  useTimeUpdate(updateTime);

  const enabled = (setting) => localStorage.getItem(setting) === 'true';
  const zoomClock = Number(localStorage.getItem('zoomClock') || defaults.zoomClock);

  return (
    <Suspense fallback={<></>}>
      <div className={`clockBackground ${enabled('roundClock') ? 'round' : ''}`} ref={elementRef}>
        <Clock
          value={currentDate}
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
