import React from 'react';
import Checkbox from '../Checkbox';

export default function AppearanceSettings (props) {
  return (
    <div>
        <h2>{props.language.title}</h2>
        <Checkbox name='darkTheme' text={props.language.dark} />
        <Checkbox name='brightnessTime' text={props.language.night_mode} betaFeature={true} />
        <h3>Accessibility</h3>
        <Checkbox name='animations' text={props.language.animations} betaFeature={true} />
        <ul>
            <p>Zoom (100%) <span className='modalLink'>{props.language.reset}</span></p>
            <input className='range' type='range' min='50' max='200' value={100} />
        </ul>
        <ul>
            <p>Toast Duration (2500 milliseconds) <span className='modalLink'>{props.language.reset}</span></p>
            <input className='range' type='range' min='50' max='200' value={100} />
        </ul>
    </div>
  );
}