function VerticalClock({ finalHour, finalMinute, finalSeconds }) {
  const hourColour = localStorage.getItem('hourColour') || '#fff';
  const minuteColour = localStorage.getItem('minuteColour') || '#fff';
  const secondColour = localStorage.getItem('secondColour') || '#fff';

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
