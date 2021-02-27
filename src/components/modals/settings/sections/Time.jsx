import React from 'react';

import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';

export default function TimeSettings (props) {
  return (
    <div>
      <h2>Time</h2>
      <Checkbox name='seconds' text={props.language.time.seconds} />
      <Checkbox name='24hour' text={props.language.time.twentyfourhour} />
      <Checkbox name='ampm' text={props.language.time.ampm} />
      <Checkbox name='zero' text={props.language.time.zero} />
      <Checkbox name='analog' text={props.language.time.analog} />
      <Checkbox name='percentageComplete' text={props.language.time.percentageComplete} />
      <h3>Date</h3>
      <Checkbox name='short' text={props.language.date.short_date} betaFeature={true} />
      <Dropdown label={props.language.date.short_format} name='dateFormat' id='dateformat' onChange={() => localStorage.setItem('dateFormat', document.getElementById('dateformat').value)}>
        <option className='choices' value='DMY'>DMY</option>
        <option className='choices' value='MDY'>MDY</option>
        <option className='choices' value='YMD'>YMD</option>
      </Dropdown>
    </div>
  );
}