import { PureComponent, Fragment } from 'react';

import { ColorPicker } from 'react-color-gradient-picker';

import hexToRgb from '../../../../../../modules/helpers/background/hexToRgb';
import rgbToHex from '../../../../../../modules/helpers/background/rgbToHex';

import { toast } from 'react-toastify';

import 'react-color-gradient-picker/dist/index.css';
import '../../../scss/settings/react-color-picker-gradient-picker-custom-styles.scss';

export default class ColourSettings extends PureComponent {
  DefaultGradientSettings = { angle: '180', gradient: [{ colour: '#ffb032', stop: 0 }], type: 'linear' };
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
    toast(window.language.toasts.reset);
  }

  initialiseColourPickerState(gradientSettings) {
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
        // Disregard exception
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

    const reminderInfo = document.querySelector('.reminder-info');
    if (reminderInfo.style.display !== 'block') {
      reminderInfo.style.display = 'block';
      localStorage.setItem('showReminder', true);
    }
  }

  addColour = () => {
    this.setState((s) => {
      const [lastGradient, ...initGradients] = s.gradientSettings.gradient.reverse();
      const newState = {
        gradientSettings: {
          ...s.gradientSettings,
          gradient: [...initGradients, lastGradient, { colour: localStorage.getItem('theme') === 'dark' ? '#000000' : '#ffffff', stop: 100 }].sort((a, b) => (a.stop > b.stop) ? 1 : -1)
        }
      };
      return newState;
    });

    window.stats.postEvent('setting', 'Changed backgroundtype from colour to gradient');
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

  onColourPickerChange = (attrs, name) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(attrs, name);
    }

    this.setState({
      gradientSettings: {
        angle: attrs.degree,
        gradient: attrs.points.map((p) => {
          return {
            colour: '#' + rgbToHex(p.red, p.green, p.blue),
            stop: p.left
          }}),
        type: attrs.type
      }
    });

    const reminderInfo = document.querySelector('.reminder-info');
    if (reminderInfo.style.display !== 'block') {
      reminderInfo.style.display = 'block';
      localStorage.setItem('showReminder', true);
    }
  };

  render() {
    const { background } = this.language.sections;

    let colourSettings = null;
    if (typeof this.state.gradientSettings === 'object') {
      const gradientHasMoreThanOneColour = this.state.gradientSettings.gradient.length > 1;

      let gradientInputs;
      if (gradientHasMoreThanOneColour) {
        if (this.GradientPickerInitalState === undefined) {
          this.initialiseColourPickerState(this.state.gradientSettings);
        }

        gradientInputs = (
          <ColorPicker
            onStartChange={(colour) => this.onColourPickerChange(colour, 'start')}
            onChange={(colour) => this.onColourPickerChange(colour, 'change')}
            onEndChange={(colour) => this.onColourPickerChange(colour, 'end')}
            gradient={this.GradientPickerInitalState}
            isGradient/>
        );
      } else {
        gradientInputs = this.state.gradientSettings.gradient.map((g, i) => {
          return (
            <Fragment key={i}>
              <input id={'colour_' + i} type='color' name='colour' className='colour' onChange={(event) => this.onGradientChange(event, i)} value={g.colour}></input>
              <label htmlFor={'colour_' + i} className='customBackgroundHex'>{g.colour}</label>
            </Fragment>
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
