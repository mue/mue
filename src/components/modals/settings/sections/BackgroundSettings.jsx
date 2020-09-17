import React from 'react';
import { toast } from 'react-toastify';

export default class BackgroundSettings extends React.PureComponent {
   componentDidMount() {
        document.getElementById('bg-input').onchange = (e) => {
            const reader = new FileReader();
            const file = e.target.files[0];

            if (file.size > 2000000) return toast('File is over 2MB', '#ff0000', '#ffffff');

            reader.addEventListener('load', (e) => {
              localStorage.setItem('customBackground', e.target.result);
              document.getElementById('customBackground').src = e.target.result;
              document.getElementById('customBackground').value = e.target.result;
              document.getElementById('backgroundImage').setAttribute('style', `-webkit-filter:blur(${localStorage.getItem('blur')}px); background-image: url(${localStorage.getItem('customBackground')}`);
              document.getElementById('backgroundImage').style.backgroundImage = `url(${localStorage.getItem('customBackground')})`;
            });

            reader.readAsDataURL(file);
        };
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
              <p>{this.props.language.background.blur} (<span id='blurAmount'></span>%) <span className='modalLink' onClick={() => this.props.resetItem('blur')}>{this.props.language.reset}</span></p>
              <input className='range' type='range' min='0' max='100' id='blurRange' onInput={() => document.getElementById('blurAmount').innerText = document.getElementById('blurRange').value} />
            </ul>
            <ul>
              <p>{this.props.language.background.brightness} (<span id='brightnessAmount'></span>%) <span className='modalLink' onClick={() => this.props.resetItem('brightness')}>{this.props.language.reset}</span></p>
              <input className='range' type='range' min='0' max='100' id='brightnessRange' onInput={() => document.getElementById('brightnessAmount').innerText = document.getElementById('brightnessRange').value} />
            </ul>
            <ul>
              <p>{this.props.language.background.customURL} <span className='modalLink' onClick={() => this.props.resetItem('customBackground')}>{this.props.language.reset}</span></p>
              <input type='text' id='customBackground'></input>
            </ul>
            <ul>
              <p>{this.props.language.background.custombackground} <span className='modalLink' onClick={() => this.props.resetItem('customBackground')}>{this.props.language.reset}</span></p>
              <button className='uploadbg' onClick={() => document.getElementById('bg-input').click()}>{this.props.language.background.upload}</button>
              <input id='bg-input' type='file' name='name' className='hidden' accept='image/svg+xml, image/jpeg, image/png, image/webp, image/webm, image/gif' />
            </ul>
           { /* <ul>
              <p>{this.props.language.background.customcolour} <span className='modalLink' onClick={() => this.resetItem('customBackgroundColour')}>Reset</span></p>
              <input name='colour' type='color' id='customBackgroundColour' onChange={() => document.getElementById('customBackgroundHex').innerText = document.getElementById('customBackgroundColour').value}></input>
              <label htmlFor='colour' id='customBackgroundHex'>#00000</label>
           </ul> */ }
        </div>
    );
  }
}