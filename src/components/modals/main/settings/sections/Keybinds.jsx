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

  action(action, e) {
    switch (action) {
      case 'listen':
        this.listen(e);
        break;
      case 'cancel':
        this.cancel(e);
        break;
      case 'reset':
        this.reset(e);
        break;
      default:
        break;
    }
  }

  render() {
    const { getMessage, languagecode } = this;

    return (
      <>
        <h2>{getMessage(languagecode, 'modals.main.settings.sections.keybinds.title')}</h2>
        <Switch name='keybindsEnabled' text={getMessage(languagecode, 'modals.main.settings.enabled')} element='.other' />
        <KeybindInput name={getMessage(languagecode, 'modals.main.settings.sections.keybinds.background.favourite')} state={this.state.keybinds} setting='favouriteBackground' action={(type, e) => this.action(type, e)}/>
        <KeybindInput name={getMessage(languagecode, 'modals.main.settings.sections.keybinds.background.maximise')} state={this.state.keybinds} setting='maximiseBackground' action={(type, e) => this.action(type, e)}/>
        <KeybindInput name={getMessage(languagecode, 'modals.main.settings.sections.keybinds.background.download')} state={this.state.keybinds} setting='downloadBackground' action={(type, e) => this.action(type, e)}/>
        <KeybindInput name={getMessage(languagecode, 'modals.main.settings.sections.keybinds.background.show_info')} state={this.state.keybinds} setting='showBackgroundInformation' action={(type, e) => this.action(type, e)}/>
        <KeybindInput name={getMessage(languagecode, 'modals.main.settings.sections.keybinds.quote.favourite')} state={this.state.keybinds} setting='favouriteQuote' action={(type, e) => this.action(type, e)}/>
        <KeybindInput name={getMessage(languagecode, 'modals.main.settings.sections.keybinds.quote.copy')} state={this.state.keybinds} setting='copyQuote' action={(type, e) => this.action(type, e)}/>
        <KeybindInput name={getMessage(languagecode, 'modals.main.settings.sections.keybinds.quote.tweet')} state={this.state.keybinds} setting='tweetQuote' action={(type, e) => this.action(type, e)}/>
        <KeybindInput name={getMessage(languagecode, 'modals.main.settings.sections.keybinds.notes.pin')} state={this.state.keybinds} setting='pinNotes' action={(type, e) => this.action(type, e)}/>
        <KeybindInput name={getMessage(languagecode, 'modals.main.settings.sections.keybinds.notes.copy')} state={this.state.keybinds} setting='copyNotes' action={(type, e) => this.action(type, e)}/>
        <KeybindInput name={getMessage(languagecode, 'modals.main.settings.sections.keybinds.search')} state={this.state.keybinds} setting='focusSearch' action={(type, e) => this.action(type, e)}/>
        <KeybindInput name={getMessage(languagecode, 'modals.main.settings.sections.keybinds.quicklinks')} state={this.state.keybinds} setting='toggleQuicklinks' action={(type, e) => this.action(type, e)}/>
        <KeybindInput name={getMessage(languagecode, 'modals.main.settings.sections.keybinds.modal')} state={this.state.keybinds} setting='toggleModal' action={(type, e) => this.action(type, e)}/>
      </>
    );
  }
}
