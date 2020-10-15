import React from 'react';
import SettingsFunctions from '../../../modules/settingsFunctions';
import Checkbox from '../settings/Checkbox';
import Section from '../settings/Section';
import { toast } from 'react-toastify';

import BackgroundSettings from '../settings/sections/BackgroundSettings';
import SearchSettings from '../settings/sections/SearchSettings';
import LanguageSettings from '../settings/sections/LanguageSettings';

export default class Settings extends React.PureComponent {
  resetGreeting() {
    document.getElementById('greetingName').value = '';
    toast(this.props.toastLanguage.reset);
  }

  componentDidMount() {
    // Settings
    document.getElementById('greetingName').value = localStorage.getItem('greetingName');
    document.getElementById('language').value = localStorage.getItem('language');

    if (document.getElementById('modal').classList.contains('dark')) { // Dark theme support for dropdowns
      const choices = document.getElementsByClassName('choices');
      for (let i = 0; i < choices.length; i++) choices[i].style.backgroundColor = '#2f3542';
    }

    document.getElementById('file-input').onchange = (e) => { // import settings
      const file = e.target.files[0];
      if (file.type !== 'application/json') return console.error(`expected json, got ${file.type}`);

      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');

      reader.onload = (readerEvent) => {
        const content = JSON.parse(readerEvent.target.result);
        for (const key of Object.keys(content)) localStorage.setItem(key, content[key]);
        toast(this.props.toastLanguage.imported);
      };
    };
  }

  render() {
    return (
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
              <p>{this.props.language.greeting.name} <span className='modalLink' onClick={() => this.resetGreeting()}>{this.props.language.reset}</span></p>
              <input type='text' id='greetingName'></input>
            </ul>
          </Section>

          <Section title={this.props.language.quote.title} name='quote'>
            <Checkbox name='copyButton' text={this.props.language.quote.copy} />
            <Checkbox name='tweetButton' text={this.props.language.quote.tweet} />
            <Checkbox name='favouriteQuoteEnabled' text={this.props.language.quote.favourite} />
          </Section>

          <BackgroundSettings language={this.props.language} toastLanguage={this.props.toastLanguage} />

          <SearchSettings language={this.props.language} toastLanguage={this.props.toastLanguage} />

          <Section title={this.props.language.offline} name='offlineMode' noDropdown={true} />
          <Section title={this.props.language.dark} name='darkTheme' noDropdown={true} />

          <Section title={this.props.language.experimental.title} name='experimental' slider={false}>
            <Checkbox name='webp' text={this.props.language.experimental.webp} />
            <Checkbox name='animations' text={this.props.language.experimental.animations} />
            <Checkbox name='voiceSearch' text={this.props.language.experimental.voicesearch} newFeature={true} />
            <Checkbox name='brightnessTime' text={this.props.language.experimental.nightmode} newFeature={true} />
          </Section>

          <LanguageSettings language={this.props.language} />

          <button className='apply' onClick={() => SettingsFunctions.saveStuff(this.props.language.background.disabled)}>{this.props.language.apply}</button>
          <button className='reset' onClick={() => SettingsFunctions.setDefaultSettings()}>{this.props.language.reset}</button>
          <button className='export' onClick={() => SettingsFunctions.exportSettings()}>{this.props.language.export}</button>
          <button className='import' onClick={() => document.getElementById('file-input').click()}>{this.props.language.import}</button>
          <input id='file-input' type='file' name='name' className='hidden' accept='application/json' />
        </div>
    );
  }
}
