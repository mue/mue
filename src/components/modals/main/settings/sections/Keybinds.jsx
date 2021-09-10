import variables from 'modules/variables';
import { PureComponent } from 'react';

import Switch from '../Switch';
import KeybindInput from '../KeybindInput';

export default class KeybindSettings extends PureComponent {
  getMessage = (languagecode, text) => variables.language.getMessage(languagecode, text);
  languagecode = variables.languagecode;

  constructor() {
    super();
    this.state = {
      keybinds: JSON.parse(localStorage.getItem('keybinds')) || {}
    };
  }

  showReminder() {
    document.querySelector('.reminder-info').style.display = 'none';
    return localStorage.setItem('showReminder', false);
  }

  listen(type) {
    const currentKeybinds = this.state.keybinds;
    currentKeybinds[type] = this.getMessage(this.languagecode, 'modals.main.settings.sections.keybinds.recording');
    this.setState({
      keybinds: currentKeybinds
    });
    this.forceUpdate();

    let keys = '';
    this.keydown = document.addEventListener('keydown', (event) => {
      if (keys === '') {
        keys = event.key;
      } else {
        keys = `${keys}+${event.key}`;
      }
    });

    this.keyup = document.addEventListener('keyup', () => {
      document.removeEventListener('keydown', this.keydown);
      const keybinds = this.state.keybinds;
      keybinds[type] = keys;
      localStorage.setItem('keybinds', JSON.stringify(keybinds));
      this.setState({
        keybinds: JSON.parse(localStorage.getItem('keybinds')) || {}
      });
    });

    document.removeEventListener('keyup', this.keyup);

    this.showReminder();
  }

  cancel(type) {
    document.removeEventListener('keydown', this.keydown);
    document.removeEventListener('keyup', this.keyup);
    const currentKeybinds = this.state.keybinds;
    delete currentKeybinds[type];
    this.setState({
      keybinds: currentKeybinds
    });
    this.forceUpdate();
  }

  reset(type) {
    const keybinds = this.state.keybinds;
    keybinds[type] = '';
    localStorage.setItem('keybinds', JSON.stringify(keybinds));
    this.setState({
      keybinds: JSON.parse(localStorage.getItem('keybinds')) || {}
    });

    this.showReminder();
  }

  render() {
    return (
      <>
        <h2>{this.getMessage(this.languagecode, 'modals.main.settings.sections.keybinds.title')}</h2>
        <Switch name='keybindsEnabled' text={this.getMessage(this.languagecode, 'modals.main.settings.enabled')} element='.other' />
        <KeybindInput name={this.getMessage(this.languagecode, 'modals.main.settings.sections.keybinds.background.favourite')} state={this.state.keybinds} settingsName='favouriteBackground' set={(e) => this.listen(e)} reset={(e) => this.reset(e)} cancel={(e) => this.cancel(e)}/>
        <KeybindInput name={this.getMessage(this.languagecode, 'modals.main.settings.sections.keybinds.background.maximise')} state={this.state.keybinds} settingsName='maximiseBackground' set={(e) => this.listen(e)} reset={(e) => this.reset(e)} cancel={(e) => this.cancel(e)}/>
        <KeybindInput name={this.getMessage(this.languagecode, 'modals.main.settings.sections.keybinds.background.download')} state={this.state.keybinds} settingsName='downloadBackground' set={(e) => this.listen(e)} reset={(e) => this.reset(e)} cancel={(e) => this.cancel(e)}/>
        <KeybindInput name={this.getMessage(this.languagecode, 'modals.main.settings.sections.keybinds.background.show_info')} state={this.state.keybinds} settingsName='showBackgroundInformation' set={(e) => this.listen(e)} reset={(e) => this.reset(e)} cancel={(e) => this.cancel(e)}/>
        <KeybindInput name={this.getMessage(this.languagecode, 'modals.main.settings.sections.keybinds.quote.favourite')} state={this.state.keybinds} settingsName='favouriteQuote' set={(e) => this.listen(e)} reset={(e) => this.reset(e)} cancel={(e) => this.cancel(e)}/>
        <KeybindInput name={this.getMessage(this.languagecode, 'modals.main.settings.sections.keybinds.quote.copy')} state={this.state.keybinds} settingsName='copyQuote' set={(e) => this.listen(e)} reset={(e) => this.reset(e)} cancel={(e) => this.cancel(e)}/>
        <KeybindInput name={this.getMessage(this.languagecode, 'modals.main.settings.sections.keybinds.quote.tweet')} state={this.state.keybinds} settingsName='tweetQuote' set={(e) => this.listen(e)} reset={(e) => this.reset(e)} cancel={(e) => this.cancel(e)}/>
        <KeybindInput name={this.getMessage(this.languagecode, 'modals.main.settings.sections.keybinds.notes.pin')} state={this.state.keybinds} settingsName='pinNotes' set={(e) => this.listen(e)} reset={(e) => this.reset(e)} cancel={(e) => this.cancel(e)}/>
        <KeybindInput name={this.getMessage(this.languagecode, 'modals.main.settings.sections.keybinds.notes.copy')} state={this.state.keybinds} settingsName='copyNotes' set={(e) => this.listen(e)} reset={(e) => this.reset(e)} cancel={(e) => this.cancel(e)}/>
        <KeybindInput name={this.getMessage(this.languagecode, 'modals.main.settings.sections.keybinds.search')} state={this.state.keybinds} settingsName='focusSearch' set={(e) => this.listen(e)} reset={(e) => this.reset(e)} cancel={(e) => this.cancel(e)}/>
        <KeybindInput name={this.getMessage(this.languagecode, 'modals.main.settings.sections.keybinds.quicklinks')} state={this.state.keybinds} settingsName='toggleQuicklinks' set={(e) => this.listen(e)} reset={(e) => this.reset(e)} cancel={(e) => this.cancel(e)}/>
        <KeybindInput name={this.getMessage(this.languagecode, 'modals.main.settings.sections.keybinds.modal')} state={this.state.keybinds} settingsName='toggleModal' set={(e) => this.listen(e)} reset={(e) => this.reset(e)} cancel={(e) => this.cancel(e)}/>
      </>
    );
  }
}
