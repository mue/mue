import React from 'react';

import { ColorPicker } from 'react-color-gradient-picker';

import hexToRgb from '../../../../../../modules/helpers/background/hexToRgb';
import rgbToHex from '../../../../../../modules/helpers/background/rgbToHex';

import { toast } from 'react-toastify';

import 'react-color-gradient-picker/dist/index.css';

export default class ColourSettings extends React.PureComponent {
  DefaultGradientSettings = { 'angle': '180', 'gradient': [{ 'colour': '#ffb032', 'stop': 0 }], 'type': 'linear' };
  GradientPickerInitalState = undefined;
  
  constructor() {
    super();
    this.state = {
      gradientSettings: this.DefaultGradientSettings
    };
    this.language = window.language.modals.main.settings;
  }

  resetColour() {
    localStorage.setItem('customBackgroundColour', '');
    this.setState({
      gradientSettings: this.DefaultGradientSettings
    });
    toast(this.language.toasts.reset);
  }

  initialiseColorPickerState(gradientSettings) {
    this.GradientPickerInitalState = {
      points: gradientSettings.gradient.map((g) => {
        const rgb = hexToRgb(g.colour);
        return {
          left: +g.stop,
          red: rgb.red,
          green: rgb.green,
          blue: rgb.blue,
          alpha: 1
        };
      }),
      degree: + gradientSettings.angle,
      type: gradientSettings.type
    };
  }

  componentDidMount() {
    const hex = localStorage.getItem('customBackgroundColour');
    let gradientSettings = undefined;

    if (hex !== '') {
      try {
        gradientSettings = JSON.parse(hex);
      } catch (e) {
        // Disregard exception.
      }
    }

    if (gradientSettings === undefined) {
      gradientSettings = this.DefaultGradientSettings;
    }

    this.setState({
      gradientSettings
    });
  }

  componentDidUpdate() {
    localStorage.setItem('customBackgroundColour', document.getElementById('customBackgroundHex').value);
  }

  onGradientChange = (event, index) => {
    const newValue = event.target.value;
    const name = event.target.name;
    this.setState((s) => {
      const newState = {
        gradientSettings: {
          ...s.gradientSettings,
          gradient: s.gradientSettings.gradient.map((g, i) => i === index ? { ...g, [name]: newValue } : g)
        }
      };
      return newState;
    });
  }

  addColour = () => {
    this.setState((s) => {
      const [lastGradient, ...initGradients] = s.gradientSettings.gradient.reverse();
      const newState = {
        gradientSettings: {
          ...s.gradientSettings,
          gradient: [...initGradients, lastGradient, { 'colour': localStorage.getItem('theme') === 'dark' ? '#000000' : '#ffffff', stop: 100 }].sort((a, b) => (a.stop > b.stop) ? 1 : -1)
        }
      };
      return newState;
    });
  }

  currentGradientSettings = () => {
    if (typeof this.state.gradientSettings === 'object' && this.state.gradientSettings.gradient.every(g => g.colour !== this.language.sections.background.source.disabled)) {
      const clampNumber = (num, a, b) => Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
      return JSON.stringify({
        ...this.state.gradientSettings,
        gradient: [...this.state.gradientSettings.gradient.map(g => { return { ...g, stop: clampNumber(+g.stop, 0, 100) } })].sort((a, b) => (a.stop > b.stop) ? 1 : -1)
      });
    }
    return this.language.sections.background.source.disabled;
  }

  onColorPickerChange = (attrs, name) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(attrs, name);
    }

    this.setState({
      gradientSettings: {
        'angle': attrs.degree,
        'gradient': attrs.points.map((p) => {
          return {
            'colour': '#' + rgbToHex(p.red, p.green, p.blue),
            'stop': p.left
          }}),
        'type': attrs.type
      }
    });
  };

  render() {
    const { background } = this.language.sections;

    let colourSettings = null;
    if (typeof this.state.gradientSettings === 'object') {
      const gradientHasMoreThanOneColour = this.state.gradientSettings.gradient.length > 1;

      let gradientInputs;
      if (gradientHasMoreThanOneColour) {
        if (this.GradientPickerInitalState === undefined) {
          this.initialiseColorPickerState(this.state.gradientSettings);
        }

        gradientInputs = (
          <ColorPicker
            onStartChange={(color) => this.onColorPickerChange(color, 'start')}
            onChange={(color) => this.onColorPickerChange(color, 'change')}
            onEndChange={(color) => this.onColorPickerChange(color, 'end')}
            gradient={this.GradientPickerInitalState}
            isGradient/>
        );
      } else {
        gradientInputs = this.state.gradientSettings.gradient.map((g, i) => {
          return (
            <React.Fragment key={i}>
              <input id={'colour_' + i} type='color' name='colour' className='colour' onChange={(event) => this.onGradientChange(event, i)} value={g.colour}></input>
              <label htmlFor={'colour_' + i} className='customBackgroundHex'>{g.colour}</label>
            </React.Fragment>
          );
        });
      }

      colourSettings = (
        <>
          {gradientInputs}
          {!gradientHasMoreThanOneColour ? (<><br/><br/><button type='button' className='add' onClick={this.addColour}>{background.source.add_colour}</button></>) : null}
        </>
      );
    }

    return (
      <>
        <p>{background.source.custom_colour} <span className='modalLink' onClick={() => this.resetColour()}>{this.language.buttons.reset}</span></p>
        <input id='customBackgroundHex' type='hidden' value={this.currentGradientSettings()} />
        {colourSettings}
      </>
    );
  }
}