import { PureComponent } from 'react';

import Checkbox from '../Checkbox';

export default class KeybindSettings extends PureComponent {
  constructor() {
    super();
    this.state = {
      keybinds: JSON.parse(localStorage.getItem('keybinds')) || {}
    };
    this.language = window.language.modals.main.settings;
  }

  listen(type) {
    let currentKeybinds = this.state.keybinds;
    currentKeybinds[type] = 'Recording...';
    this.setState({
      keybinds: currentKeybinds
    });
    this.forceUpdate();

    let keys = '';
    const keydown = document.addEventListener('keydown', (event) => {
      if (keys === '') {
        keys = event.key;
      } else {
        keys = `${keys}+${event.key}`;
      }
    });

    const keyup = document.addEventListener('keyup', () => {
      document.removeEventListener('keydown', keydown);
      let keybinds = this.state.keybinds;
      keybinds[type] = keys;
      localStorage.setItem('keybinds', JSON.stringify(keybinds));
      this.setState({
        keybinds: JSON.parse(localStorage.getItem('keybinds')) || {}
      });
    });

    document.removeEventListener('keyup', keyup);

    document.querySelector('.reminder-info').style.display = 'block';
    return localStorage.setItem('showReminder', true);
  }

  reset(type) {
    let keybinds = this.state.keybinds;
    keybinds[type] = '';
    localStorage.setItem('keybinds', JSON.stringify(keybinds));
    this.setState({
      keybinds: JSON.parse(localStorage.getItem('keybinds')) || {}
    });

    document.querySelector('.reminder-info').style.display = 'block';
    return localStorage.setItem('showReminder', true);
  }

  render() {
    return (
      <>
        <h2>Keybinds</h2>
        <Checkbox name='keybindsEnabled' text='Enabled' element='.other' />
        <div className='keybind'>
          <p>Favourite Background</p>
          <input type='text' onClick={() => this.listen('favouriteBackground')} value={this.state.keybinds['favouriteBackground'] || ''} readOnly/>
          <span className='modalLink' onClick={() => this.reset('favouriteBackground')}>Reset</span>
        </div>
        <div className='keybind'>
          <p>Maximise Background</p>
          <input type='text' onClick={() => this.listen('maximiseBackground')} value={this.state.keybinds['maximiseBackground'] || ''} readOnly/>
          <span className='modalLink' onClick={() => this.reset('maximiseBackground')}>Reset</span>
        </div>
        <div className='keybind'>
          <p>Pin Notes</p>
          <input type='text' onClick={() => this.listen('pinNotes')} value={this.state.keybinds['pinNotes'] || ''} readOnly/>
          <span className='modalLink' onClick={() => this.reset('pinNotes')}>Reset</span>
        </div>
      </>
    );
  }
}
