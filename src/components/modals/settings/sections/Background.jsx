import React from 'react';

import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';
import FileUpload from '../FileUpload';

import { ColorPicker } from 'react-color-gradient-picker';
import hexToRgb from '../../../../modules/helpers/background/hexToRgb';
import rgbToHex from '../../../../modules/helpers/background/rgbToHex';

import { toast } from 'react-toastify';

import 'react-color-gradient-picker/dist/index.css';
import '../../../../scss/react-color-picker-gradient-picker-custom-styles.scss';

export default class BackgroundSettings extends React.PureComponent {
  DefaultGradientSettings = { 'angle': '180', 'gradient': [{ 'colour': this.props.language.disabled, 'stop': 0 }], 'type': 'linear' };
  GradientPickerInitalState = undefined;

  constructor(...args) {
    super(...args);
    this.state = {
      blur: 0,
      brightness: 100,
      customBackground: localStorage.getItem('customBackground') || '',
      gradientSettings: this.DefaultGradientSettings
    };
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
        document.getElementById('customBackground').value = '';
        break;

      case 'blur':
        localStorage.setItem('blur', 0);
        this.setState({
          blur: 0
        });
        break;

      case 'brightness':
        localStorage.setItem('brightness', 100);
        this.setState({
          brightness: 100
        });
        break;

      default:
        toast('resetItem requires a key!');
    }

    toast(this.props.toastLanguage.reset);
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
      blur: localStorage.getItem('blur'),
      brightness: localStorage.getItem('brightness'),
      gradientSettings
    });

    document.getElementById('backgroundAPI').value = localStorage.getItem('backgroundAPI');
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
          gradient: [...initGradients, lastGradient, { 'colour': localStorage.getItem('darkTheme') === 'true' ? '#000000' : '#ffffff', stop: 100 }].sort((a, b) => (a.stop > b.stop) ? 1 : -1)
        }
      };
      return newState;
    });
  }

  currentGradientSettings = () => {
    if (typeof this.state.gradientSettings === 'object' && this.state.gradientSettings.gradient.every(g => g.colour !== this.props.language.disabled)) {
      const clampNumber = (num, a, b) => Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
      return JSON.stringify({
        ...this.state.gradientSettings,
        gradient: [...this.state.gradientSettings.gradient.map(g => { return { ...g, stop: clampNumber(+g.stop, 0, 100) } })].sort((a, b) => (a.stop > b.stop) ? 1 : -1)
      });
    }
    return this.props.language.disabled;
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
    localStorage.setItem('blur', this.state.blur);
    localStorage.setItem('brightness', this.state.brightness);
    localStorage.setItem('customBackground', this.state.customBackground);

    if (document.getElementById('customBackgroundHex').value !== this.props.backgroundDisabled) {
      localStorage.setItem('customBackgroundColour', document.getElementById('customBackgroundHex').value);
    }
  }

  render() {
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
            isGradient />
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
        <div>
          {gradientInputs}
          {this.state.gradientSettings.gradient[0].colour !== this.props.language.disabled &&
           !gradientHasMoreThanOneColour ? (<button type='button' className='add' onClick={this.addColour}>{this.props.language.add_colour}</button>) : null
          }
        </div>
      );
    }

    return (
      <div>
        <h2>Background</h2>
        <Checkbox name='background' text='Enabled' />
        <h3>Buttons</h3>
        <ul>
          <Checkbox name='view' text={this.props.language.view} />
          <Checkbox name='favouriteEnabled' text={this.props.language.favourite} />
          <Checkbox name='refresh' text={this.props.language.refresh} />
        </ul>
        <h3>Effects</h3>
        <ul>
          <p>{this.props.language.blur} ({this.state.blur}%) <span className='modalLink' onClick={() => this.resetItem('blur')}>{this.props.language.reset}</span></p>
          <input className='range' type='range' min='0' max='100' value={this.state.blur} onChange={(event) => this.setState({ blur: event.target.value })} />
        </ul>
        <ul>
          <p>{this.props.language.brightness} ({this.state.brightness}%) <span className='modalLink' onClick={() => this.resetItem('brightness')}>{this.props.language.reset}</span></p>
          <input className='range' type='range' min='0' max='100' value={this.state.brightness} onChange={(event) => this.setState({ brightness: event.target.value })} />
        </ul>
        <h3>Source</h3>
        <ul>
          <Dropdown
            label={this.props.language.api}
            name='backgroundapi'
            id='backgroundAPI'
            onChange={() => localStorage.setItem('backgroundAPI', document.getElementById('backgroundAPI').value)} >
              <option className='choices' value='mue'>Mue</option>
              <option className='choices' value='unsplash'>Unsplash</option>
          </Dropdown>
        </ul>
        <ul>
          <p>{this.props.language.custom_url} <span className='modalLink' onClick={() => this.resetItem('customBackground')}>{this.props.language.reset}</span></p>
          <input type='text' value={this.state.customBackground} onChange={(e) => this.setState({ customBackground: e.target.value })}></input>
        </ul>
        <ul>
          <p>{this.props.language.custom_background} <span className='modalLink' onClick={() => this.resetItem('customBackground')}>{this.props.language.reset}</span></p>
          <button className='uploadbg' onClick={() => document.getElementById('bg-input').click()}>{this.props.language.upload}</button>
          <FileUpload id='bg-input' accept='image/jpeg, image/png, image/webp, image/webm, image/gif' loadFunction={(e) => this.fileUpload(e)} />
        </ul>
        <ul>
          <p>{this.props.language.custom_colour} <span className='modalLink' onClick={() => this.resetItem('customBackgroundColour')}>{this.props.language.reset}</span></p>
          <input id='customBackgroundHex' type='hidden' value={this.currentGradientSettings()} />
          {colourSettings}
        </ul>
      </div>
    );
  }
}
