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
    const currentKeybinds = this.state.keybinds;
    currentKeybinds[type] = this.language.sections.keybinds.recording;
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
      const keybinds = this.state.keybinds;
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
    const { keybinds } = this.language.sections;

    return (
      <>
        <h2>{keybinds.title}</h2>
        <Checkbox name='keybindsEnabled' text={this.language.enabled} element='.other' />
        <div>
          <p>{keybinds.background.favourite}</p>
          <input type='text' onClick={() => this.listen('favouriteBackground')} value={this.state.keybinds['favouriteBackground'] || ''} readOnly/>
          <span className='modalLink' onClick={() => this.reset('favouriteBackground')}>{this.language.buttons.reset}</span>
        </div>
        <div>
          <p>{keybinds.background.maximise}</p>
          <input type='text' onClick={() => this.listen('maximiseBackground')} value={this.state.keybinds['maximiseBackground'] || ''} readOnly/>
          <span className='modalLink' onClick={() => this.reset('maximiseBackground')}>{this.language.buttons.reset}</span>
        </div>
        <div>
          <p>{keybinds.background.download}</p>
          <input type='text' onClick={() => this.listen('downloadBackground')} value={this.state.keybinds['downloadBackground'] || ''} readOnly/>
          <span className='modalLink' onClick={() => this.reset('downloadBackground')}>{this.language.buttons.reset}</span>
        </div>
        <div>
          <p>{keybinds.background.show_info}</p>
          <input type='text' onClick={() => this.listen('showBackgroundInformation')} value={this.state.keybinds['showBackgroundInformation'] || ''} readOnly/>
          <span className='modalLink' onClick={() => this.reset('showBackgroundInformation')}>{this.language.buttons.reset}</span>
        </div>
        <div>
          <p>{keybinds.quote.favourite}</p>
          <input type='text' onClick={() => this.listen('favouriteQuote')} value={this.state.keybinds['favouriteQuote'] || ''} readOnly/>
          <span className='modalLink' onClick={() => this.reset('favouriteQuote')}>{this.language.buttons.reset}</span>
        </div>
        <div>
          <p>{keybinds.quote.copy}</p>
          <input type='text' onClick={() => this.listen('copyQuote')} value={this.state.keybinds['copyQuote'] || ''} readOnly/>
          <span className='modalLink' onClick={() => this.reset('copyQuote')}>{this.language.buttons.reset}</span>
        </div>
        <div>
          <p>{keybinds.quote.tweet}</p>
          <input type='text' onClick={() => this.listen('tweetQuote')} value={this.state.keybinds['tweetQuote'] || ''} readOnly/>
          <span className='modalLink' onClick={() => this.reset('tweetQuote')}>{this.language.buttons.reset}</span>
        </div>
        <div>
          <p>{keybinds.notes.pin}</p>
          <input type='text' onClick={() => this.listen('pinNotes')} value={this.state.keybinds['pinNotes'] || ''} readOnly/>
          <span className='modalLink' onClick={() => this.reset('pinNotes')}>{this.language.buttons.reset}</span>
        </div>
        <div>
          <p>{keybinds.notes.copy}</p>
          <input type='text' onClick={() => this.listen('copyNotes')} value={this.state.keybinds['copyNotes'] || ''} readOnly/>
          <span className='modalLink' onClick={() => this.reset('copyNotes')}>{this.language.buttons.reset}</span>
        </div>
        <div>
          <p>{keybinds.search}</p>
          <input type='text' onClick={() => this.listen('focusSearch')} value={this.state.keybinds['focusSearch'] || ''} readOnly/>
          <span className='modalLink' onClick={() => this.reset('focusSearch')}>{this.language.buttons.reset}</span>
        </div>
        <div>
          <p>{keybinds.quicklinks}</p>
          <input type='text' onClick={() => this.listen('toggleQuicklinks')} value={this.state.keybinds['toggleQuicklinks'] || ''} readOnly/>
          <span className='modalLink' onClick={() => this.reset('toggleQuicklinks')}>{this.language.buttons.reset}</span>
        </div>
        <div>
          <p>{keybinds.modal}</p>
          <input type='text' onClick={() => this.listen('toggleModal')} value={this.state.keybinds['toggleModal'] || ''} readOnly/>
          <span className='modalLink' onClick={() => this.reset('toggleModal')}>{this.language.buttons.reset}</span>
        </div>
      </>
    );
  }
}
