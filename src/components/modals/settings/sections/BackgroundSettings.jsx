import React from 'react';
import { toast } from 'react-toastify';

export default class BackgroundSettings extends React.PureComponent {
  resetItem(key) {
    switch (key) {
      case 'customBackgroundColour':
        localStorage.setItem('customBackgroundColour', '');
        document.getElementById('customBackgroundHex').textContent = 'Disabled';
        break;
      case 'customBackground': document.getElementById('customBackground').value = ''; break;
      case 'blur':
        localStorage.setItem('blur', 0);
        document.getElementById('blurRange').value = 0;
        document.getElementById('blurAmount').innerText = '0';
        break;
      case 'brightness':
        localStorage.setItem('brightness', 100);
        document.getElementById('brightnessRange').value = 100;
        document.getElementById('brightnessAmount').innerText = '100';
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
      if (hex !== '') {
          document.getElementById('customBackgroundColour').value = hex;
          document.getElementById('customBackgroundHex').innerText = hex;
      } else document.getElementById('customBackgroundHex').innerText = 'Disabled';

      const blur = localStorage.getItem('blur');
      const brightness = localStorage.getItem('brightness');

      document.getElementById('blurAmount').innerText = blur;
      document.getElementById('blurRange').value = blur;

      document.getElementById('brightnessAmount').innerText = brightness;
      document.getElementById('brightnessRange').value = brightness;

      document.getElementById('customBackground').value = localStorage.getItem('customBackground');
      document.getElementById('backgroundAPI').value = localStorage.getItem('backgroundAPI');
    }

  render() {
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
              <p>{this.props.language.background.blur} (<span id='blurAmount'></span>%) <span className='modalLink' onClick={() => this.resetItem('blur')}>{this.props.language.reset}</span></p>
              <input className='range' type='range' min='0' max='100' id='blurRange' onInput={() => document.getElementById('blurAmount').innerText = document.getElementById('blurRange').value} />
            </ul>
            <ul>
              <p>{this.props.language.background.brightness} (<span id='brightnessAmount'></span>%) <span className='modalLink' onClick={() => this.resetItem('brightness')}>{this.props.language.reset}</span></p>
              <input className='range' type='range' min='0' max='100' id='brightnessRange' onInput={() => document.getElementById('brightnessAmount').innerText = document.getElementById('brightnessRange').value} />
            </ul>
            <ul>
              <p>{this.props.language.background.customURL} <span className='modalLink' onClick={() => this.resetItem('customBackground')}>{this.props.language.reset}</span></p>
              <input type='text' id='customBackground'></input>
            </ul>
            <ul>
              <p>{this.props.language.background.custombackground} <span className='modalLink' onClick={() => this.resetItem('customBackground')}>{this.props.language.reset}</span></p>
              <button className='uploadbg' onClick={() => document.getElementById('bg-input').click()}>{this.props.language.background.upload}</button>
              <input id='bg-input' type='file' name='name' className='hidden' accept='image/svg+xml, image/jpeg, image/png, image/webp, image/webm, image/gif' />
            </ul>
           <ul>
              <p>{this.props.language.background.customcolour} <span className='modalLink' onClick={() => this.resetItem('customBackgroundColour')}>{this.props.language.reset}</span></p>
              <input name='colour' type='color' id='customBackgroundColour' onChange={() => document.getElementById('customBackgroundHex').innerText = document.getElementById('customBackgroundColour').value}></input>
              <label htmlFor='colour' id='customBackgroundHex'>#00000</label>
           </ul>
        </div>
    );
  }
}