import React from 'react';

import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';

export default function TimeSettings (props) {
  return (
    <div>
      <h2>{props.language.title}</h2>
      <Checkbox name='time' text='Enabled' />
      <Checkbox name='seconds' text={props.language.seconds} />
      <Checkbox name='24hour' text={props.language.twentyfourhour} />
      <Checkbox name='ampm' text={props.language.ampm} />
      <Checkbox name='zero' text={props.language.zero} />
      <Checkbox name='analog' text={props.language.analog} />
      <Checkbox name='percentageComplete' text={props.language.percentageComplete} />
      <h3>{props.language.date.title}</h3>
      <Checkbox name='date' text='Enabled' />
      <Checkbox name='short' text={props.language.date.short_date} betaFeature={true} />
      <Dropdown label={props.language.date.short_format} name='dateFormat' id='dateformat' onChange={() => localStorage.setItem('dateFormat', document.getElementById('dateformat').value)}>
        <option className='choices' value='DMY'>DMY</option>
        <option className='choices' value='MDY'>MDY</option>
        <option className='choices' value='YMD'>YMD</option>
      </Dropdown>
    </div>
  );
}
