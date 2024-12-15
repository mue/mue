import { useState, useEffect, Suspense, memo } from 'react';
import { AnalogClock } from './components/AnalogClock';
import { VerticalClock } from './components/VerticalClock';
import { DigitalClock } from './components/DigitalClock';
import { PercentageClock } from './components/PercentageClock';
import EventBus from 'utils/eventbus';
import defaults from './options/default';
import ErrorBoundary from '../../ErrorBoundary';
import { TimeProvider } from './context/TimeContext';

import 'react-clock/dist/Clock.css';
import './clock.scss';

const ClockContent = () => {
  const [timeType, setTimeType] = useState(localStorage.getItem('timeType') || defaults.timeType);

  useEffect(() => {
    const handleRefresh = (data) => {
      if (data === 'clock' || data === 'timezone') {
        const element = document.querySelector('.clock-container');
        if (localStorage.getItem('time') === 'false') {
          element.style.display = 'none';
          return;
        }

        element.style.display = 'block';
        setTimeType(localStorage.getItem('timeType'));

        // Handle zoom updates
        const zoomClock = localStorage.getItem('zoomClock') || defaults.zoomClock;
        if (localStorage.getItem('timeType') !== 'analogue') {
          element.style.fontSize = `${4 * Number(zoomClock / 100)}em`;
        }
      }
    };

    EventBus.on('refresh', handleRefresh);
    return () => EventBus.off('refresh', handleRefresh);
  }, []);

  const renderClock = () => {
    switch (timeType) {
      case 'analogue':
        return <AnalogClock />;
      case 'verticalClock':
        return <VerticalClock />;
      case 'percentageComplete':
        return <PercentageClock />;
      default:
        return <DigitalClock />;
    }
  };

  return (
    <ErrorBoundary fallback={<div className="clock-error">Error loading clock</div>}>
      <Suspense fallback={<div className="clock-loading"></div>}>{renderClock()}</Suspense>
    </ErrorBoundary>
  );
};

const Clock = ({ isPreview, staticTime }) => {
  return (
    <TimeProvider staticTime={staticTime}>
      <ClockContent />
    </TimeProvider>
  );
};

export default memo(Clock);
