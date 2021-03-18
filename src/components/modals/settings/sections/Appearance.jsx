import React from 'react';
import Checkbox from '../Checkbox';

export default function AppearanceSettings (props) {
  return (
    <div>
      <h2>{props.language.title}</h2>
      <Checkbox name='darkTheme' text={props.language.dark_theme} />
      <Checkbox name='brightnessTime' text={props.language.night_mode} />
      <h3>{props.language.accessibility.title}</h3>
      <Checkbox name='animations' text={props.language.animations} betaFeature={true} />
      <ul>
        <p>{props.language.accessibility.zoom} (100%) <span className='modalLink'>Reset</span></p>
        <input className='range' type='range' min='50' max='200' value={100} />
      </ul>
      <ul>
        <p>{props.language.accessibility.toast_duration} (2500 {props.language.accessibility.milliseconds}) <span className='modalLink'>{props.language.reset}</span></p>
        <input className='range' type='range' min='50' max='200' value={100} />
      </ul>
    </div>
  );
}
