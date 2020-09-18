import React from 'react';
import SettingsFunctions from '../../modules/settingsFunctions';
import Checkbox from './settings/Checkbox';
import Slider from './settings/Slider';
import Section from './settings/Section';
import { toast } from 'react-toastify';

import BackgroundSettings from './settings/sections/BackgroundSettings';
import ExperimentalSettings from './settings/sections/ExperimentalSettings';
import SearchSettings from './settings/sections/SearchSettings';
import LanguageSettings from './settings/sections/LanguageSettings';

export default class Settings extends React.PureComponent {
  resetItem(key) {
    switch (key) {
      case 'greetingName': document.getElementById('greetingName').value = ''; break;
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
      case 'customSearchEngine': document.getElementById('searchEngine').value = 'DuckDuckGo'; break;
      default: toast('resetItem requires a key!');
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
      const value = localStorage.getItem(key);

      if (key === 'blur') {
        document.getElementById('blurAmount').innerText = value;
        document.getElementById('blurRange').value = value;
      }

      if (key === 'brightness') {
        document.getElementById('brightnessAmount').innerText = value;
        document.getElementById('brightnessRange').value = value;
      }

      const tag = document.getElementById(`${key}Status`);
      if (tag) tag.checked = (value === 'true');
    }

    if (localStorage.getItem('darkTheme') === 'true') {
      document.getElementById('blurRange').style.background = '#535c68';
      document.getElementById('brightnessRange').style.background = '#535c68';
      document.getElementById('customBackground').style.color = 'white';
      document.getElementById('backgroundAPI').style.color = 'white';
      document.getElementById('searchEngine').style.color = 'white';
      document.getElementById('language').style.color = 'white';
      document.getElementById('greetingName').style.color = 'white';
      const choices = document.getElementsByClassName('choices');
      for (let i = 0; i < choices.length; i++) choices[i].style.backgroundColor = '#2f3542';
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
        toast(this.props.toastLanguage.imported_settings);
      };
    };

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
        <div className='tab'>
          <button className='tablinks' onClick={this.props.openMarketplace}>{this.props.modalLanguage.marketplace}</button>
          <button className='tablinks' onClick={this.props.openAddons}>{this.props.modalLanguage.addons}</button>
          <button className='tablinks' id='active'>{this.props.modalLanguage.settings}</button>
        </div>
        <br/>

      <div className='columns'>
        <Section title={this.props.language.time.title} name='time'>
            <Checkbox name='seconds' text={this.props.language.time.seconds} />
            <Checkbox name='24hour' text={this.props.language.time.twentyfourhour} />
            <Checkbox name='ampm' text={this.props.language.time.ampm} />
            <Checkbox name='zero' text={this.props.language.time.zero} />
            <Checkbox name='analog' text={this.props.language.time.analog} />
        </Section>
        <Section title={this.props.language.greeting.title} name='greeting'>
          <Checkbox name='events' text={this.props.language.greeting.events} />
          <Checkbox name='defaultGreetingMessage' text={this.props.language.greeting.default} />
          <ul>
            <p>{this.props.language.greeting.name} <span className='modalLink' onClick={() => this.resetItem('greetingName')}>{this.props.language.reset}</span></p>
            <input type='text' id='greetingName'></input>
          </ul>
        </Section>
        <Section title={this.props.language.quote.title} name='quote'>
          <Checkbox name='copyButton' text={this.props.language.quote.copy} />
          <Checkbox name='tweetButton' text='Tweet Button' />
        </Section>
        <Section title={this.props.language.background.title} name='background'>
          <BackgroundSettings language={this.props.language} resetItem={(item) => this.resetItem(item)}/>
        </Section>
        <Section title={this.props.language.searchbar.title} name='searchBar'>
          <SearchSettings language={this.props.language} resetItem={(item) => this.resetItem(item)}/>
        </Section>
        <div className='section'>
          <h4>{this.props.language.offline}</h4>
          <Slider name='offlineMode'/>
        </div>
        <div className='section'>
          <h4>{this.props.language.experimental.dark}</h4>
          <Slider name='darkTheme'/>
        </div>
        <ExperimentalSettings language={this.props.language} />
        <LanguageSettings language={this.props.language} />

        <button className='apply' onClick={() => SettingsFunctions.saveStuff()}>{this.props.language.apply}</button>
        <button className='reset' onClick={() => this.props.setDefaultSettings()}>{this.props.language.reset}</button>
        <button className='export' onClick={() => SettingsFunctions.exportSettings()}>{this.props.language.export}</button>
        <button className='import' onClick={() => document.getElementById('file-input').click()}>{this.props.language.import}</button>
        <input id='file-input' type='file' name='name' className='hidden' />
      </div>
    </div>;
  }
}
