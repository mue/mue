import React from 'react';
import Checkbox from '../Checkbox';

export default class AppearanceSettings extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      zoom: 100,
      toast_duration: 2500
    };
  }

  render() {
    const { appearance } = this.props.language.sections;

    return (
      <div>
        <h2>{appearance.title}</h2>
        <Checkbox name='darkTheme' text={appearance.dark_theme} />
        <Checkbox name='brightnessTime' text={appearance.night_mode} />
        <h3>{appearance.accessibility.title}</h3>
        <Checkbox name='animations' text={appearance.animations} betaFeature={true} />
        <ul>
          <p>{appearance.accessibility.zoom} (100%) <span className='modalLink'>{this.props.language.buttons.reset}</span></p>
          <input className='range' type='range' min='50' max='200' value={100} />
        </ul>
        <ul>
          <p>{appearance.accessibility.toast_duration} (2500 {appearance.accessibility.milliseconds}) <span className='modalLink'>{this.props.language.buttons.reset}</span></p>
          <input className='range' type='range' min='50' max='200' value={100} />
        </ul>
      </div>
    );
  }
}
