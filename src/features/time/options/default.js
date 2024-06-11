const DefaultDateOptions = {
  date: false,
  dateType: 'long',
  longFormat: 'DMY',
  dayofweek: false,
  datenth: false,
  dateFormat: 'DMY',
  shortFormat: 'dots',
  zoomDate: 100,
  weeknumber: false,
  datezero: false,
};

const DefaultTimeOptions = {
  time: true,
  timeType: 'digital',
  hourColour: '#ffffff',
  minuteColour: '#ffffff',
  secondColour: '#ffffff',
  timeformat: 'twentyfourhour',
  seconds: false,
  zero: true,
  secondHand: false,
  minuteHand: true,
  hourHand: true,
  hourMarks: false,
  minuteMarks: false,
  roundClock: true,
  zoomClock: 100,
};

const DefaultOptions = {
  date: DefaultDateOptions,
  time: DefaultTimeOptions,
};

export default DefaultOptions;
