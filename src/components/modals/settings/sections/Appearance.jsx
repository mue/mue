import React from 'react';

import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';

import { toast } from 'react-toastify';

export default class AppearanceSettings extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      zoom: localStorage.getItem('zoom'),
      toast_duration: localStorage.getItem('toastDisplayTime'),
      font: localStorage.getItem('font') || ''
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

      case 'font':
        localStorage.setItem('font', '');
        this.setState({
          font: ''
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
    localStorage.setItem('font', this.state.font.charAt(0).toUpperCase() + this.state.font.slice(1));
  }

  componentDidMount() {
    document.getElementById('fontWeight').value = localStorage.getItem('fontWeight') || 400;
  }

  render() {
    const { appearance } = this.props.language.sections;

    return (
      <div>
        <h2>{appearance.title}</h2>
        <Checkbox name='darkTheme' text={appearance.dark_theme} />
        <Checkbox name='brightnessTime' text={appearance.night_mode} />

        <h3>{appearance.navbar.title}</h3>
        <Checkbox name='notesEnabled' text={appearance.navbar.notes} />
        <Checkbox name='refresh' text={appearance.navbar.refresh} />
  
        <h3>{appearance.font.title}</h3>
        <ul>
          <p>{appearance.font.custom} <span className='modalLink' onClick={() => this.resetItem('font')}>{this.props.language.buttons.reset}</span></p>
          <input type='text' value={this.state.font} onChange={(e) => this.setState({ font: e.target.value })}></input>
        </ul>
        <Dropdown
            label='Font Weight'
            name='fontweight'
            id='fontWeight'
            onChange={() => localStorage.setItem('fontWeight', document.getElementById('fontWeight').value)}>
              {/* names are taken from https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight */}
              <option className='choices' value='100'>Thin</option>
              <option className='choices' value='200'>Extra-Light</option>
              <option className='choices' value='300'>Light</option>
              <option className='choices' value='400'>Normal</option>
              <option className='choices' value='500'>Medium</option>
              <option className='choices' value='600'>Semi-Bold</option>
              <option className='choices' value='700'>Bold</option>
              <option className='choices' value='800'>Extra-Bold</option>
        </Dropdown>
        <Checkbox name='fontGoogle' text={appearance.font.google} />

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
