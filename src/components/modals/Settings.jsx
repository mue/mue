import React from 'react';
import ExpandMore from '@material-ui/icons/ExpandMore';
import SettingsFunctions from '../../modules/settingsFunctions';
import Checkbox from './settings/Checkbox';
import Slider from './settings/Slider';
import { toast } from 'react-toastify';

export default class Settings extends React.PureComponent {
  resetItem(key) {
    switch (key) {
      case 'greetingName': document.getElementById('greetingName').value = ''; break;
      case 'customBackgroundColour':
        localStorage.setItem('customBackgroundColour', '');
        document.getElementById('customBackgroundColour').enabled = 'false';
        break;
      case 'customBackground': document.getElementById('customBackground').value = ''; break;
      case 'blur':
        localStorage.setItem('blur', 0);
        document.getElementById('blurRange').value = 0;
        document.getElementById('blurAmount').innerText = '0';
        break;
      case 'customSearchEngine': document.getElementById('searchEngine').value = 'DuckDuckGo'; break;
      default: console.log('[ERROR] resetItem requires a key!');
    }
    toast(this.props.toastLanguage.reset);
  }

  updateCurrent() {
    document.getElementById('greetingName').value = localStorage.getItem('greetingName');
    document.getElementById('customBackground').value = localStorage.getItem('customBackground');
    document.getElementById('backgroundAPI').value = localStorage.getItem('backgroundAPI');
    document.getElementById('language').value = localStorage.getItem('language');
    document.getElementById('searchEngine').value = localStorage.getItem('searchEngine');
    // document.getElementById('backgroundImage').style.backgroundUrl = localStorage.getItem('customBackground');

    for (const key of Object.keys(localStorage)) {
      let value = localStorage.getItem(key);

      if (key === 'blur') {
        document.getElementById('blurAmount').innerText = value;
        document.getElementById('blurRange').value = value;
      }

      const tag = document.getElementById(`${key}Status`);

      if (tag) {
        switch (value) {
          case 'true': value = true; break;
          case 'false': value = false; break;
          default: value = true;
        }
        tag.checked = value;
      }
    }

    if (localStorage.getItem('darkTheme') === 'true') {
      document.getElementById('blurRange').style.background = '#535c68';
      document.getElementById('customBackground').style.color = 'white';
      document.getElementById('backgroundAPI').style.color = 'white';
      document.getElementById('searchEngine').style.color = 'white';
      document.getElementById('language').style.color = 'white';
      /*[1, 2, 3, 4, 5].forEach((index) => {
        console.log(index)
        document.getElementsByClassName('choices')[index].style.background = 'black';
      })*/
      document.getElementById('greetingName').style.color = 'white';
    }
  }

  componentDidMount() {
    this.updateCurrent();

    document.getElementById('file-input').onchange = (e) => {
      const file = e.target.files[0];
      if (file.type !== 'application/json') return console.error(`expected json, got ${file.type}`);

      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');

      reader.onload = (readerEvent) => {
        const content = JSON.parse(readerEvent.target.result);
        for (const key of Object.keys(content)) localStorage.setItem(key, content[key]);
        toast('Imported settings!');
      }
    }

    document.getElementById('bg-input').onchange = (e) => {
      const allowed = [ 'image/svg+xml', 'image/jpeg', 'image/png', 'image/webp', 'image/webm', 'image/gif' ];
      const reader = new FileReader();
      const file = e.target.files[0];

      if (file.size > 2000000) return toast('File is over 2MB', '#ff0000', '#ffffff');
      if (!allowed.includes(file.type)) return console.error(`expected xml, svg, png or jpeg, got ${file.type}`);

      reader.addEventListener('load', (e) => {
        localStorage.setItem('customBackground', e.target.result);
        document.getElementById('customBackground').src = e.target.result;
        document.getElementById('customBackground').value = e.target.result;
        document.getElementById('backgroundImage').setAttribute('style', `-webkit-filter:blur(${localStorage.getItem('blur')}px); background-image: url(${localStorage.getItem('customBackground')}`);
        document.getElementById('backgroundImage').style.backgroundImage = `url(${localStorage.getItem('customBackground')})`
      });

      reader.readAsDataURL(file);
    };
    /*const hex = localStorage.getItem('customBackgroundColour');
    if (!hex === '') {
      document.getElementById('customBackgroundColour').value = hex;
      document.getElementById('customBackgroundHex').innerText = hex;
    }*/


    document.getElementById('backgroundImage').classList.toggle('backgroundEffects');
    document.getElementById('center').classList.toggle('backgroundEffects');
  }

  componentWillUnmount() {
    document.getElementById('backgroundImage').classList.toggle('backgroundEffects');
    document.getElementById('center').classList.toggle('backgroundEffects');
  }

  render() {
   // let expandClassList = '';
    //if (localStorage.getItem('animations') === 'true') expandClassList = 'all 0.5 ease 0s';

    return <div className='content'>
        <span className='closeModal' onClick={this.props.modalClose}>&times;</span>
        <h1>{this.props.modalLanguage.title}</h1>
        <div className="tab">
          <button className="tablinks" onClick={this.props.openMarketplace}>{this.props.modalLanguage.marketplace}</button>
          <button className="tablinks" onClick={this.props.openAddons}>{this.props.modalLanguage.addons}</button>
          <button className="tablinks" id="active">{this.props.modalLanguage.settings}</button>
        </div>
        <br />
      <div className='columns'>
          <div className='section'>
            <h4 onClick={() => SettingsFunctions.toggleExtra(document.getElementsByClassName('extraSettings')[0], document.getElementsByClassName('expandIcons')[0])}>{this.props.language.time.title}</h4>
            <ExpandMore style={{ 'transition': 'all 0.5s ease 0s' }} className='expandIcons' onClick={() => SettingsFunctions.toggleExtra(document.getElementsByClassName('extraSettings')[0], document.getElementsByClassName('expandIcons')[0])} />
            <Slider name='time' />
          <li className='extraSettings'>
            <Checkbox name='seconds' text={this.props.language.time.seconds} />
            <Checkbox name='24hour' text={this.props.language.time.twentyfourhour} />
            <Checkbox name='ampm' text={this.props.language.time.ampm} />
            <Checkbox name='zero' text={this.props.language.time.zero} />
            <Checkbox name='analog' text={this.props.language.time.analog} />
          </li>
        </div>
        <div className='section'>
          <h4 onClick={() => SettingsFunctions.toggleExtra(document.getElementsByClassName('extraSettings')[1], document.getElementsByClassName('expandIcons')[1])}>{this.props.language.greeting.title}</h4>
          <ExpandMore style={{ 'transition': 'all 0.5s ease 0s' }} className='expandIcons' onClick={() => SettingsFunctions.toggleExtra(document.getElementsByClassName('extraSettings')[1], document.getElementsByClassName('expandIcons')[1])} />
          <Slider name='greeting' />
          <li className='extraSettings'>
          <Checkbox name='events' text={this.props.language.greeting.events} />
          <Checkbox name='defaultGreetingMessage' text={this.props.language.greeting.default} />
            <ul>
              <p>{this.props.language.greeting.name} <span className='modalLink' onClick={() => this.resetItem('greetingName')}>Reset</span></p>
              <input type='text' id='greetingName'></input>
            </ul>
          </li>
        </div>
        <div className='section'>
          <h4 onClick={() => SettingsFunctions.toggleExtra(document.getElementsByClassName('extraSettings')[2], document.getElementsByClassName('expandIcons')[2])}>{this.props.language.quote.title}</h4>
          <ExpandMore style={{ 'transition': 'all 0.5s ease 0s' }} className='expandIcons' onClick={() => SettingsFunctions.toggleExtra(document.getElementsByClassName('extraSettings')[2], document.getElementsByClassName('expandIcons')[2])} />
          <Slider name='quote' />
          <li className='extraSettings'>
            <Checkbox name='copyButton' text={this.props.language.quote.copy} />
          </li>
        </div>
        <div className='section'>
          <h4 onClick={() => SettingsFunctions.toggleExtra(document.getElementsByClassName('extraSettings')[3], document.getElementsByClassName('expandIcons')[3])}>{this.props.language.background.title}</h4>
          <ExpandMore style={{ 'transition': 'all 0.5s ease 0s' }} className='expandIcons' onClick={() => SettingsFunctions.toggleExtra(document.getElementsByClassName('extraSettings')[3], document.getElementsByClassName('expandIcons')[3])} />
          <Slider name='background' override='customBackground' />
          <li className='extraSettings'>
          <ul>
            <label htmlFor='8'>{this.props.language.background.API} </label>
            <label className='dropdown'>
              <select className='select-css' name='8' id='backgroundAPI' onChange={() => localStorage.setItem('backgroundAPI', document.getElementById('backgroundAPI').value)}>
                <option value='mue'>Mue</option>
                <option value='unsplash'>Unsplash</option>
                { /* <option value='custom'>Custom</option> */ }
              </select>
            </label>
            </ul>
            <ul>
              <p>{this.props.language.background.blur} (<span id='blurAmount'></span>%) <span className='modalLink' onClick={() => this.resetItem('blur')}>Reset</span></p>
              <input className='range' type='range' min='0' max='100' id='blurRange' onInput={() => document.getElementById('blurAmount').innerText = document.getElementById('blurRange').value} />
            </ul>
            <ul>
              <p>{this.props.language.background.customURL} <span className='modalLink' onClick={() => this.resetItem('customBackground')}>Reset</span></p>
              <input type='text' id='customBackground'></input>
            </ul>
            <ul>
              <p>{this.props.language.background.custombackground} <span className='modalLink' onClick={() => this.resetItem('customBackground')}>Reset</span></p>
              <button className='uploadbg' onClick={() => document.getElementById('bg-input').click()}>Upload</button>
              <input id='bg-input' type='file' name='name' className='hidden' />
            </ul>
           { /* <ul>
              <p>{this.props.language.background.customcolour} <span className='modalLink' onClick={() => this.resetItem('customBackgroundColour')}>Reset</span></p>
              <input name='colour' type='color' id='customBackgroundColour' onChange={() => document.getElementById('customBackgroundHex').innerText = document.getElementById('customBackgroundColour').value}></input>
              <label htmlFor='colour' id='customBackgroundHex'>#00000</label>
           </ul> */ }
          </li>
        </div>
        <div className='section'>
          <h4 onClick={() => SettingsFunctions.toggleExtra(document.getElementsByClassName('extraSettings')[4], document.getElementsByClassName('expandIcons')[4])}>{this.props.language.searchbar.title}</h4>
          <ExpandMore style={{ 'transition': 'all 0.5s ease 0s' }} className='expandIcons' onClick={() => SettingsFunctions.toggleExtra(document.getElementsByClassName('extraSettings')[4], document.getElementsByClassName('expandIcons')[4])} />
          <Slider name='searchBar' />
          <li className='extraSettings'>
            <ul>
            <label htmlFor='4'>{this.props.language.searchbar.searchengine} </label>
              <select className='select-css' name='4' id='searchEngine' onChange={() => SettingsFunctions.setSearchEngine(document.getElementById('searchEngine').value)}>
                <option value='duckduckgo'>DuckDuckGo</option>
                <option value='google'>Google</option>
                <option value='bing'>Bing</option>
                <option value='yahoo'>Yahoo</option>
                <option value='ecosia'>Ecosia</option>
                <option value='yandex'>Yandex</option>
                <option value='qwant'>Qwant</option>
                <option value='ask'>Ask</option>
                <option value='startpage'>Startpage</option>
               {/* <option value='custom'>Custom</option> */}
              </select>
            </ul>
            <ul id='searchEngineInput' style={{ display: 'none' }}>
              <p style={{"marginTop": "0px"}}>Custom Search URL <span className='modalLink' onClick={() => this.resetItem('customSearchEngine')}>Reset</span></p>
              <input type='text' id='customSearchEngine'></input>
            </ul>
          </li>
        </div>
        <div className='section'>
          <h4>{this.props.language.offline}</h4>
          <Slider name='offlineMode' />
        </div>
        <h3>{this.props.language.experimental.title}</h3>
        <div className='section'>
          <h4>{this.props.language.experimental.webp}</h4>
          <Slider name='webp' />
        </div>
        <div className='section'>
          <h4>{this.props.language.experimental.dark}</h4>
          <Slider name='darkTheme' />
        </div>
        <div className='section'>
          <h4>{this.props.language.experimental.animations}</h4>
          <Slider name='animations' />
        </div>
        <div className='section'>
        <h4 htmlFor='9'>{this.props.language.language} </h4>
          <select className='select-css' name='9' id='language' onChange={() => localStorage.setItem('language', document.getElementById('language').value)}>
            <option className='choices' value='en'>English</option>
            <option className='choices' value='nl'>Nederlands</option>
            <option className='choices' value='fr'>Français</option>
            <option className='choices' value='no'>Norsk</option>
            <option className='choices' value='ru'>Russian</option>
          </select>
        </div>
        <button className='apply' onClick={() => SettingsFunctions.saveStuff()}>{this.props.language.apply}</button>
        <button className='reset' onClick={() => this.props.setDefaultSettings()}>{this.props.language.reset}</button>
        <button className='export' onClick={() => SettingsFunctions.exportSettings()}>{this.props.language.export}</button>
        <button className='import' onClick={() => document.getElementById('file-input').click()}>{this.props.language.import}</button>
        <input id='file-input' type='file' name='name' className='hidden' />
      </div>
    </div>;
  }
}