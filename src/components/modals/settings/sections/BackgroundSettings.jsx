import React from 'react';
import { toast } from 'react-toastify';
import Checkbox from '../Checkbox';
import Section from '../Section';
import { ColorPicker } from 'react-color-gradient-picker';
import 'react-color-gradient-picker/dist/index.css';

export default class BackgroundSettings extends React.PureComponent {
  DefaultGradientSettings = { "angle": "180", "gradient": [{ "colour": this.props.language.background.disabled, "stop": 0 }], "type": "linear" };
  GradientPickerInitalState = undefined;

  constructor(...args) {
    super(...args);
    this.state = {
      blur: 0,
      brightness: 100,
      gradientSettings: this.DefaultGradientSettings
    };
  }

  resetItem(key) {
    switch (key) {
      case 'customBackgroundColour':
        localStorage.setItem('customBackgroundColour', '');
        this.setState({ gradientSettings: this.DefaultGradientSettings });
        break;
      case 'customBackground': document.getElementById('customBackground').value = ''; break;
      case 'blur':
        localStorage.setItem('blur', 0);
        this.setState({ blur: 0 });
        break;
      case 'brightness':
        localStorage.setItem('brightness', 100);
        this.setState({ blur: 100 });
        break;
      default: toast('resetItem requires a key!');
    }
    toast(this.props.toastLanguage.reset);
  }


  setRGBA(red, green, blue, alpha) {
    if (this.isValidRGBValue(red) && this.isValidRGBValue(green) && this.isValidRGBValue(blue)) {
      var color = {
        red: red | 0,
        green: green | 0,
        blue: blue | 0,
      };

      if (this.isValidRGBValue(alpha) === true) {
        color.alpha = alpha | 0;
      }

      // RGBToHSL(color.r, color.g, color.b);

      return color;
    }
  }
  isValidRGBValue(value) {
    return (typeof (value) === 'number' && Number.isNaN(value) === false && value >= 0 && value <= 255);
  }
  rgbToHSv(ref) {
    var red = ref.red;
    var green = ref.green;
    var blue = ref.blue;

    var rr;
    var gg;
    var bb;
    var h;
    var s;

    var rabs = red / 255;
    var gabs = green / 255;
    var babs = blue / 255;
    var v = Math.max(rabs, gabs, babs);
    var diff = v - Math.min(rabs, gabs, babs);
    var diffc = function (c) { return (v - c) / 6 / diff + 1 / 2; };
    if (diff === 0) {
      h = 0;
      s = 0;
    } else {
      s = diff / v;
      rr = diffc(rabs);
      gg = diffc(gabs);
      bb = diffc(babs);

      if (rabs === v) {
        h = bb - gg;
      } else if (gabs === v) {
        h = (1 / 3) + rr - bb;
      } else if (babs === v) {
        h = (2 / 3) + gg - rr;
      }
      if (h < 0) {
        h += 1;
      } else if (h > 1) {
        h -= 1;
      }
    }

    return {
      hue: Math.round(h * 360),
      saturation: Math.round(s * 100),
      value: Math.round(v * 100),
    };
  }


  hexToRgb(value) {
    var hexRegexp = /(^#{0,1}[0-9A-F]{6}$)|(^#{0,1}[0-9A-F]{3}$)|(^#{0,1}[0-9A-F]{8}$)/i;

    var regexp = /([0-9A-F])([0-9A-F])([0-9A-F])/i;
    var valid = hexRegexp.test(value);

    if (valid) {
      if (value[0] === '#') { value = value.slice(1, value.length); }

      if (value.length === 3) { value = value.replace(regexp, '$1$1$2$2$3$3'); }

      var red = parseInt(value.substr(0, 2), 16);
      var green = parseInt(value.substr(2, 2), 16);
      var blue = parseInt(value.substr(4, 2), 16);
      var alpha = parseInt(value.substr(6, 2), 16) / 255;

      var color = this.setRGBA(red, green, blue, alpha);
      var hsv = this.rgbToHSv(Object.assign({}, color));

      return Object.assign({}, color,
        hsv);
    }

    return false;
  }

  mapFromGradientSettingsToColorPickerInitalState(gradientSettings) {
    this.GradientPickerInitalState = {
      points: gradientSettings.gradient.map((g) => {
        const rgb = this.hexToRgb(g.colour);
        return {
          left: +g.stop,
          red: rgb.red,
          green: rgb.green,
          blue: rgb.blue,
          alpha: 1
        };
      }),
      degree: +gradientSettings.angle,
      type: gradientSettings.type
    };
  }

  componentDidMount() {
    document.getElementById('bg-input').onchange = (e) => {
      const reader = new FileReader();
      const file = e.target.files[0];

      if (file.size > 2000000) return toast('File is over 2MB', '#ff0000', '#ffffff');

      reader.addEventListener('load', (e) => {
        localStorage.setItem('customBackground', e.target.result);
        document.getElementById('customBackground').src = e.target.result;
        document.getElementById('customBackground').value = e.target.result;
      });

      reader.readAsDataURL(file);
    };

    const hex = localStorage.getItem('customBackgroundColour');
    let gradientSettings = undefined;

    if (hex !== '') {
      try {
        gradientSettings = JSON.parse(hex);
      } catch (e) {
        //Disregard exception.
      }
    }

    if (gradientSettings === undefined) gradientSettings = this.DefaultGradientSettings;

    this.setState({
      blur: localStorage.getItem('blur'),
      brightness: localStorage.getItem('brightness'),
      gradientSettings
    });

    document.getElementById('customBackground').value = localStorage.getItem('customBackground');
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

  pickFirstColour = (event) => {
    const value = event.target.value;
    this.setState({ gradientSettings: { "angle": "180", "gradient": [{ "colour": value, "stop": 0 }], "type": "linear" } });
  }

  addColour = () => {
    this.setState((s) => {
      const [lastGradient, ...initGradients] = s.gradientSettings.gradient.reverse();
      const newState = {
        gradientSettings: {
          ...s.gradientSettings,
          gradient: [...initGradients, lastGradient, { 'colour': '#000000', stop: 100 }].sort((a, b) => (a.stop > b.stop) ? 1 : -1)
        }
      };
      return newState;
    });
  }

  removeColour = (index) => {
    this.setState((s) => {
      const newState = {
        gradientSettings: {
          ...s.gradientSettings,
          gradient: s.gradientSettings.gradient.filter((g, i) => i !== index)
        }
      };
      return newState;
    });
  }

  currentGradientSettings = () => {
    if (typeof this.state.gradientSettings === 'object' && this.state.gradientSettings.gradient.every(g => g.colour !== this.props.language.background.disabled)) {
      const clampNumber = (num, a, b) => Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
      return JSON.stringify({
        ...this.state.gradientSettings,
        gradient: [...this.state.gradientSettings.gradient.map(g => { return { ...g, stop: clampNumber(+g.stop, 0, 100) } })].sort((a, b) => (a.stop > b.stop) ? 1 : -1)
      });
    }
    return this.props.language.background.disabled;
  }

  onChange = (attrs, name) => {
    console.log(attrs, name);
    function rgbToHex(red, green, blue) {
      let r16 = red.toString(16);
      let g16 = green.toString(16);
      let b16 = blue.toString(16);

      if (red < 16) r16 = `0${r16}`;
      if (green < 16) g16 = `0${g16}`;
      if (blue < 16) b16 = `0${b16}`;

      return r16 + g16 + b16;
    }
    this.setState({
      gradientSettings: { 'angle': attrs.degree, 'gradient': attrs.points.map((p) => { return { 'colour': '#' + rgbToHex(p.red, p.green, p.blue), 'stop': p.left } }), 'type': attrs.type }
    });
  };

  render() {
    let colourSettings = null;
    if (typeof this.state.gradientSettings === 'object') {
      const gradientHasMoreThanOneColour = this.state.gradientSettings.gradient.length > 1;
      let gradientInputs;
      if (gradientHasMoreThanOneColour) {
        if (this.GradientPickerInitalState === undefined) {
          this.mapFromGradientSettingsToColorPickerInitalState(this.state.gradientSettings);
        }
        gradientInputs = (<ColorPicker
          onStartChange={color => this.onChange(color, 'start')}
          onChange={color => this.onChange(color, 'change')}
          onEndChange={color => this.onChange(color, 'end')}
          gradient={this.GradientPickerInitalState}
          isGradient />);
      } else {
        gradientInputs = this.state.gradientSettings.gradient.map((g, i) => {
          return (
            <div key={i}>
              <input id={'colour_' + i} type='color' name='colour' className="colour" onChange={(event) => this.onGradientChange(event, i)} value={g.colour}></input>
              <label htmlFor={'colour_' + i} className="customBackgroundHex">{g.colour}</label>
            </div>);
        });
      }
      colourSettings = (
        <div>
          {gradientInputs}
          {this.state.gradientSettings.gradient[0].colour !== this.props.language.background.disabled && !gradientHasMoreThanOneColour ? (<button type="button" className="add" onClick={this.addColour}>{this.props.language.background.addcolour}</button>) : null}
        </div>);
    }
    return (
      <React.Fragment>
        <Section title={this.props.language.background.title} name='background'>
          <ul>
            <Checkbox name='view' text={this.props.language.background.view} />
            <Checkbox name='favouriteEnabled' text={this.props.language.background.favourite} />
            <Checkbox name='refresh' text={this.props.language.background.refresh} />
          </ul>
          <ul>
            <label htmlFor='backgroundapi'>{this.props.language.background.API} </label>
            <label className='dropdown'>
              <select className='select-css' name='backgroundapi' id='backgroundAPI' onChange={() => localStorage.setItem('backgroundAPI', document.getElementById('backgroundAPI').value)}>
                <option className='choices' value='mue'>Mue</option>
                <option className='choices' value='unsplash'>Unsplash</option>
              </select>
            </label>
          </ul>
          <ul>
            <p>{this.props.language.background.blur} ({this.state.blur}%) <span className='modalLink' onClick={() => this.resetItem('blur')}>{this.props.language.reset}</span></p>
            <input className='range' type='range' min='0' max='100' id='blurRange' value={this.state.blur} onChange={(event) => this.setState({ blur: event.target.value })} />
          </ul>
          <ul>
            <p>{this.props.language.background.brightness} ({this.state.brightness}%) <span className='modalLink' onClick={() => this.resetItem('brightness')}>{this.props.language.reset}</span></p>
            <input className='range' type='range' min='0' max='100' id='brightnessRange' value={this.state.brightness} onChange={(event) => this.setState({ brightness: event.target.value })} />
          </ul>
          <ul>
            <p>{this.props.language.background.customURL} <span className='modalLink' onClick={() => this.resetItem('customBackground')}>{this.props.language.reset}</span></p>
            <input type='text' id='customBackground'></input>
          </ul>
          <ul>
            <p>{this.props.language.background.custombackground} <span className='modalLink' onClick={() => this.resetItem('customBackground')}>{this.props.language.reset}</span></p>
            <button className='uploadbg' onClick={() => document.getElementById('bg-input').click()}>{this.props.language.background.upload}</button>
            <input id='bg-input' type='file' name='name' className='hidden' accept='image/jpeg, image/png, image/webp, image/webm, image/gif' />
          </ul>
          <ul>
            <p>{this.props.language.background.customcolour} <span className='modalLink' onClick={() => this.resetItem('customBackgroundColour')}>{this.props.language.reset}</span></p>
            <input id='customBackgroundHex' type='hidden' value={this.currentGradientSettings()} />
            {colourSettings}
          </ul>
        </Section>
      </React.Fragment>
    );
  }
}