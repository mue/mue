import { PureComponent } from 'react';

import Switch from '../Switch';
import KeybindInput from '../KeybindInput';

export default class KeybindSettings extends PureComponent {
  constructor() {
    super();
    this.state = {
      keybinds: JSON.parse(localStorage.getItem('keybinds')) || {}
    };
    this.language = window.language.modals.main.settings;
  }

  showReminder() {
    document.querySelector('.reminder-info').style.display = 'none';
    return localStorage.setItem('showReminder', false);
  }

  listen(type) {
    const currentKeybinds = this.state.keybinds;
    currentKeybinds[type] = this.language.sections.keybinds.recording;
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
    const { keybinds } = this.language.sections;

    return (
      <>
        <h2>{keybinds.title}</h2>
        <Switch name='keybindsEnabled' text={this.language.enabled} element='.other' />
        <KeybindInput name={keybinds.background.favourite} state={this.state.keybinds} settingsName='favouriteBackground' set={(e) => this.listen(e)} reset={(e) => this.reset(e)} cancel={(e) => this.cancel(e)}/>
        <KeybindInput name={keybinds.background.maximise} state={this.state.keybinds} settingsName='maximiseBackground' set={(e) => this.listen(e)} reset={(e) => this.reset(e)} cancel={(e) => this.cancel(e)}/>
        <KeybindInput name={keybinds.background.download} state={this.state.keybinds} settingsName='downloadBackground' set={(e) => this.listen(e)} reset={(e) => this.reset(e)} cancel={(e) => this.cancel(e)}/>
        <KeybindInput name={keybinds.background.show_info} state={this.state.keybinds} settingsName='showBackgroundInformation' set={(e) => this.listen(e)} reset={(e) => this.reset(e)} cancel={(e) => this.cancel(e)}/>
        <KeybindInput name={keybinds.quote.favourite} state={this.state.keybinds} settingsName='favouriteQuote' set={(e) => this.listen(e)} reset={(e) => this.reset(e)} cancel={(e) => this.cancel(e)}/>
        <KeybindInput name={keybinds.quote.copy} state={this.state.keybinds} settingsName='copyQuote' set={(e) => this.listen(e)} reset={(e) => this.reset(e)} cancel={(e) => this.cancel(e)}/>
        <KeybindInput name={keybinds.quote.tweet} state={this.state.keybinds} settingsName='tweetQuote' set={(e) => this.listen(e)} reset={(e) => this.reset(e)} cancel={(e) => this.cancel(e)}/>
        <KeybindInput name={keybinds.notes.pin} state={this.state.keybinds} settingsName='pinNotes' set={(e) => this.listen(e)} reset={(e) => this.reset(e)} cancel={(e) => this.cancel(e)}/>
        <KeybindInput name={keybinds.notes.copy} state={this.state.keybinds} settingsName='copyNotes' set={(e) => this.listen(e)} reset={(e) => this.reset(e)} cancel={(e) => this.cancel(e)}/>
        <KeybindInput name={keybinds.search} state={this.state.keybinds} settingsName='focusSearch' set={(e) => this.listen(e)} reset={(e) => this.reset(e)} cancel={(e) => this.cancel(e)}/>
        <KeybindInput name={keybinds.quicklinks} state={this.state.keybinds} settingsName='toggleQuicklinks' set={(e) => this.listen(e)} reset={(e) => this.reset(e)} cancel={(e) => this.cancel(e)}/>
        <KeybindInput name={keybinds.modal} state={this.state.keybinds} settingsName='toggleModal' set={(e) => this.listen(e)} reset={(e) => this.reset(e)} cancel={(e) => this.cancel(e)}/>
      </>
    );
  }
}
