import React from 'react';

import Checkbox from '../Checkbox';

import { toast } from 'react-toastify';

export default class AppearanceSettings extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      zoom: localStorage.getItem('zoom'),
      toast_duration: localStorage.getItem('toastDisplayTime')
    };
  }

  resetItem(key) {
    switch (key) {
      case 'zoom':
        localStorage.setItem('zoom', 100);
        this.setState({
          zoom: 100
        });
        break;

      case 'toast_duration':
        localStorage.setItem('toastDisplayTime', 2500);
        this.setState({
          toast_duration: 2500
        });
        break;

      default:
        toast('resetItem requires a key!');
    }

    toast(this.props.language.toasts.reset);
  }

  componentDidUpdate() {
    localStorage.setItem('zoom', this.state.zoom);
    localStorage.setItem('toastDisplayTime', this.state.toast_duration);
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
          <p>{appearance.accessibility.zoom} ({this.state.zoom}%) <span className='modalLink' onClick={() => this.resetItem('zoom')}>{this.props.language.buttons.reset}</span></p>
          <input className='range' type='range' min='50' max='200' value={this.state.zoom} onChange={(event) => this.setState({ zoom: event.target.value })} />
        </ul>
        <ul>
          <p>{appearance.accessibility.toast_duration} ({this.state.toast_duration} {appearance.accessibility.milliseconds}) <span className='modalLink' onClick={() => this.resetItem('toast_duration')}>{this.props.language.buttons.reset}</span></p>
          <input className='range' type='range' min='500' max='5000' value={this.state.toast_duration} onChange={(event) => this.setState({ toast_duration: event.target.value })} />
        </ul>
      </div>
    );
  }
}
