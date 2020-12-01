import React from 'react';
import SettingsFunctions from '../../../modules/helpers/settings';
import Checkbox from '../settings/Checkbox';
import Dropdown from '../settings/Dropdown';
import Section from '../settings/Section';
import FileUpload from '../settings/FileUpload';
import { toast } from 'react-toastify';

import BackgroundSettings from '../settings/sections/BackgroundSettings';
import SearchSettings from '../settings/sections/SearchSettings';
import LanguageSettings from '../settings/sections/LanguageSettings';
import GreetingSettings from '../settings/sections/GreetingSettings';

export default class Settings extends React.PureComponent {
  resetItem() {
    document.getElementById('customcss').value = '';
    toast(this.props.toastLanguage.reset);
  }

  componentDidMount() {
    // Settings
    document.getElementById('language').value = localStorage.getItem('language');
    document.getElementById('customcss').value = localStorage.getItem('customcss');

    if (document.getElementById('modal').classList.contains('dark')) { // Dark theme support for dropdowns
      const choices = document.getElementsByClassName('choices');
      for (let i = 0; i < choices.length; i++) choices[i].style.backgroundColor = '#2f3542';
    }
  }

  settingsImport(e) {
    const content = JSON.parse(e.target.result);
    for (const key of Object.keys(content)) localStorage.setItem(key, content[key]);
    toast(this.props.toastLanguage.imported);
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
            <Checkbox name='percentageComplete' text={this.props.language.time.percentageComplete} />
          </Section>

          <GreetingSettings language={this.props.language} toastLanguage={this.props.toastLanguage} />

          <Section title={this.props.language.quote.title} name='quote'>
            <Checkbox name='copyButton' text={this.props.language.quote.copy} />
            <Checkbox name='tweetButton' text={this.props.language.quote.tweet} />
            <Checkbox name='favouriteQuoteEnabled' text={this.props.language.quote.favourite} />
            <Dropdown label='Language' name='quotelanguage' id='quotelanguage' onChange={() => localStorage.setItem('quotelanguage', document.getElementById('quotelanguage').value)}>
              <option className='choices' value='English'>English</option>
              <option className='choices' value='French'>Français</option>
            </Dropdown>
          </Section>

          <Section title='Date' name='date'>
            <Checkbox name='short' text='Short Date' betaFeature={true} />
            <Dropdown label='Short Format' name='dateFormat' id='dateformat' onChange={() => localStorage.setItem('dateFormat', document.getElementById('dateformat').value)}>
              <option className='choices' value='DMY'>DMY</option>
              <option className='choices' value='MDY'>MDY</option>
              <option className='choices' value='YMD'>YMD</option>
            </Dropdown>
            <br/><br/>
            <Dropdown label='Short Separator' name='shortFormat' id='shortformat' onChange={() => localStorage.setItem('shortFormat', document.getElementById('shortformat').value)}>
              <option className='choices' value='default'>Default</option>
              <option className='choices' value='dash'>Dash</option>
              <option className='choices' value='gaps'>Gaps</option>
            </Dropdown>
          </Section>

          <BackgroundSettings language={this.props.language} toastLanguage={this.props.toastLanguage} />
          <SearchSettings language={this.props.language} toastLanguage={this.props.toastLanguage} />
          <Section title={this.props.language.offline} name='offlineMode' dropdown={false} />

          <Section title='Appearance' name='appearance' slider={false}>
            <Checkbox name='animations' text={this.props.language.experimental.animations} betaFeature={true} />
            <Checkbox name='darkTheme' text={this.props.language.dark} />
            <Checkbox name='brightnessTime' text={this.props.language.experimental.night_mode} betaFeature={true} />
            <ul>
              <p>Custom CSS <span className='modalLink' onClick={() => this.resetItem()}>{this.props.language.reset}</span> <span className='newFeature'> NEW</span></p>
              <textarea id='customcss'></textarea>
            </ul>
          </Section>

          <LanguageSettings language={this.props.language} />

          <button className='apply' onClick={() => SettingsFunctions.saveStuff(this.props.language.background.disabled)}>{this.props.language.apply}</button>
          <button className='reset' onClick={() => SettingsFunctions.setDefaultSettings('reset')}>{this.props.language.reset}</button>
          <button className='export' onClick={() => SettingsFunctions.exportSettings()}>{this.props.language.export}</button>
          <button className='import' onClick={() => document.getElementById('file-input').click()}>{this.props.language.import}</button>
          <FileUpload id='file-input' accept='application/json' type='settings' loadFunction={(e) => this.settingsImport(e)} />
        </div>
    );
  }
}
