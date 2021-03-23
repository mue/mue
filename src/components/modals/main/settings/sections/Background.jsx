import React from 'react';

import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';
import FileUpload from '../FileUpload';
import Slider from '../Slider';
import Switch from '../Switch';

import { ColorPicker } from 'react-color-gradient-picker';
import hexToRgb from '../../../../../modules/helpers/background/hexToRgb';
import rgbToHex from '../../../../../modules/helpers/background/rgbToHex';

import { toast } from 'react-toastify';

import 'react-color-gradient-picker/dist/index.css';

export default class BackgroundSettings extends React.PureComponent {
  DefaultGradientSettings = { 'angle': '180', 'gradient': [{ 'colour': window.language.modals.main.settings.sections.background.source.disabled, 'stop': 0 }], 'type': 'linear' };
  GradientPickerInitalState = undefined;

  constructor() {
    super();
    this.state = {
      customBackground: localStorage.getItem('customBackground') || '',
      gradientSettings: this.DefaultGradientSettings
    };
    this.language = window.language.modals.main.settings;
  }

  resetItem(key) {
    switch (key) {
      case 'customBackgroundColour':
        localStorage.setItem('customBackgroundColour', '');
        this.setState({
          gradientSettings: this.DefaultGradientSettings
        });
        break;

      case 'customBackground':
        localStorage.setItem('customBackground', '');
        this.setState({
          customBackground: ''
        });
        break;

      default:
        toast('resetItem requires a key!');
    }

    toast(this.language.toasts.reset);
  }

  InitializeColorPickerState(gradientSettings) {
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

  fileUpload(e) {
    localStorage.setItem('customBackground', e.target.result);
    this.setState({
      customBackground: e.target.result
    });
  }

  componentDidUpdate() {
    if (document.getElementById('customBackgroundHex').value !== this.language.sections.background.source.disabled) {
      localStorage.setItem('customBackgroundColour', document.getElementById('customBackgroundHex').value);
    }
  }

  render() {
    const { background } = this.language.sections;

    let colourSettings = null;
    if (typeof this.state.gradientSettings === 'object') {
      const gradientHasMoreThanOneColour = this.state.gradientSettings.gradient.length > 1;

      let gradientInputs;
      if (gradientHasMoreThanOneColour) {
        if (this.GradientPickerInitalState === undefined) {
          this.InitializeColorPickerState(this.state.gradientSettings);
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
            <div key={i}>
              <input id={'colour_' + i} type='color' name='colour' className='colour' onChange={(event) => this.onGradientChange(event, i)} value={g.colour}></input>
              <label htmlFor={'colour_' + i} className='customBackgroundHex'>{g.colour}</label>
            </div>
          );
        });
      }

      colourSettings = (
        <>
          {gradientInputs}
          {this.state.gradientSettings.gradient[0].colour !== background.source.disabled &&
           !gradientHasMoreThanOneColour ? (<button type='button' className='add' onClick={this.addColour}>{background.source.add_colour}</button>) : null
          }
        </>
      );
    }

    return (
      <>
        <h2>{background.title}</h2>
        <Switch name='background' text={this.language.enabled} />
        <h3>{background.buttons.title}</h3>
        <Checkbox name='view' text={background.buttons.view} />
        <Checkbox name='favouriteEnabled' text={background.buttons.favourite} />

        <h3>{background.effects.title}</h3>
        <Slider title={background.effects.blur} name='blur' min='0' max='100' default='0' display='%' />
        <Slider title={background.effects.brightness} name='brightness' min='0' max='100' default='100' display='%' />

        <h3>{background.source.title}</h3>
        <Dropdown label={background.source.api} name='backgroundAPI'>
          <option value='mue'>Mue</option>
          <option value='unsplash'>Unsplash</option>
        </Dropdown>
        {/* <Text title={background.source.custom_url} name='customBackground' /> */ }
        <ul>
          <p>{background.source.custom_url} <span className='modalLink' onClick={() => this.resetItem('customBackground')}>{this.language.buttons.reset}</span></p>
          <input type='text' value={this.state.customBackground} onChange={(e) => this.setState({ customBackground: e.target.value })}></input>
        </ul>
        <ul>
          <p>{background.source.custom_background} <span className='modalLink' onClick={() => this.resetItem('customBackground')}>{this.language.buttons.reset}</span></p>
          <button className='uploadbg' onClick={() => document.getElementById('bg-input').click()}>{background.source.upload}</button>
          <FileUpload id='bg-input' accept='image/jpeg, image/png, image/webp, image/webm, image/gif' loadFunction={(e) => this.fileUpload(e)} />
        </ul>
        <ul>
          <p>{background.source.custom_colour} <span className='modalLink' onClick={() => this.resetItem('customBackgroundColour')}>{this.language.buttons.reset}</span></p>
          <input id='customBackgroundHex' type='hidden' value={this.currentGradientSettings()} />
          {colourSettings}
        </ul>
      </>
    );
  }
}
