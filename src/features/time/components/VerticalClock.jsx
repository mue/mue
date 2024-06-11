import defaults from '../options/default';

function VerticalClock({ finalHour, finalMinute, finalSeconds }) {
  const hourColour = localStorage.getItem('hourColour') || defaults.time.hourColour;
  const minuteColour = localStorage.getItem('minuteColour') || defaults.time.minuteColour;
  const secondColour = localStorage.getItem('secondColour') || defaults.time.secondColour;

  return (
    <span className="vertical-clock clock-container">
      <div className="hour" style={{ color: hourColour }}>
        {finalHour}
      </div>
      <div className="minute" style={{ color: minuteColour }}>
        {finalMinute}
      </div>
      <div className="seconds" style={{ color: secondColour }}>
        {finalSeconds}
      </div>
    </span>
  );
}

export { VerticalClock as default, VerticalClock };
