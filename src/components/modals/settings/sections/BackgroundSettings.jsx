import React from 'react';
import { toast } from 'react-toastify';

export default class BackgroundSettings extends React.PureComponent {
  DefaultGradientSettings = { "angle": "180", "gradient": [{ "colour": "Disabled", "stop": 0 }], "type": "linear" };

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
          gradient: [...initGradients, lastGradient, { ...lastGradient, stop: 100 }].sort((a, b) => (a.stop > b.stop) ? 1 : -1)
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
    if (typeof this.state.gradientSettings === 'object' && this.state.gradientSettings.gradient.every(g => g.colour !== 'Disabled')) {
      const clampNumber = (num, a, b) => Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
      return JSON.stringify({
        ...this.state.gradientSettings,
        gradient: [...this.state.gradientSettings.gradient.map(g => { return { ...g, stop: clampNumber(+g.stop, 0, 100) } })].sort((a, b) => (a.stop > b.stop) ? 1 : -1)
      });
    }
    return 'Disabled';
  }

  render() {
    let colourSettings = null;
    if (typeof this.state.gradientSettings === 'object') {
      const gradientInputs = this.state.gradientSettings.gradient.map((g, i) => {
        const gradientHasMoreThanOneColour = this.state.gradientSettings.gradient.length > 1;
        return (
          <div key={i}>
            {gradientHasMoreThanOneColour ? (<button type='button' className='remove' onClick={() => this.removeColour(i)}>×</button>) : null}
            <input id={'colour_' + i} type='color' name='colour' className="colour" onChange={(event) => this.onGradientChange(event, i)} value={g.colour}></input>
            <label htmlFor={'colour_' + i} className="customBackgroundHex">{g.colour}</label>
            {gradientHasMoreThanOneColour ? (
                <input type="number" name='stop' className='stop' min={0} max={100} value={g.stop} onChange={(event) => this.onGradientChange(event, i)} />
              ) : null}
          </div>);
      });
      colourSettings = (
        <div>
          {gradientInputs}
          {this.state.gradientSettings.gradient[0].colour !== 'Disabled' ? (<button type="button" className="add" onClick={this.addColour}>{this.props.language.background.addColour}</button>) : null}
        </div>);
    }

    return (
      <div>
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
      </div>
    );
  }
}