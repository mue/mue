import variables from 'modules/variables';
import { PureComponent } from 'react';
import { FileCopyRounded, AssignmentRounded as NotesRounded, PushPin }from '@material-ui/icons';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { toast } from 'react-toastify';
import Hotkeys from 'react-hot-keys';

export default class Notes extends PureComponent {
  constructor() {
    super();
    this.state = {
      notes: localStorage.getItem('notes') || '',
      visibility: (localStorage.getItem('notesPinned') === 'true') ? 'visible' : 'hidden',
      marginLeft: (localStorage.getItem('refresh') === 'false') ? '-200px' : '-150px'
    };
  }

  setNotes = (e) => {
    localStorage.setItem('notes', e.target.value);
    this.setState({
      notes: e.target.value
    });
  };

  pin() {
    window.stats.postEvent('feature', 'Notes pin');

    if (localStorage.getItem('notesPinned') === 'true') {
      localStorage.setItem('notesPinned', false);
      this.setState({
        visibility: 'hidden'
      });
    } else {
      localStorage.setItem('notesPinned', true);
      this.setState({
        visibility: 'visible'
      });
    }
  }

  copy() {
    window.stats.postEvent('feature', 'Notes copied');
    navigator.clipboard.writeText(this.state.notes);
    toast(variables.language.getMessage(variables.languagecode, 'toasts.notes'));
  }

  render() {
    return (
      <span id='noteContainer' className='notescontainer' style={{ visibility: this.state.visibility, marginLeft: this.state.marginLeft }}>
        <div className='topbarnotes'>
          <NotesRounded/>
          <h3>{variables.language.getMessage(variables.languagecode, 'widgets.navbar.notes.title')}</h3>
        </div>
        <TextareaAutosize rowsmax={50} placeholder={variables.language.getMessage(variables.languagecode, 'widgets.navbar.notes.placeholder')} value={this.state.notes} onChange={this.setNotes}/>
        <button onClick={() => this.pin()} className='pinNote'><PushPin/></button>
        <button onClick={() => this.copy()} className='copyNote'><FileCopyRounded/></button>
        {window.keybinds.pinNotes && window.keybinds.pinNotes !== '' ? <Hotkeys keyName={window.keybinds.pinNotes} onKeyDown={() => this.pin()}/> : null}
        {window.keybinds.copyNotes && window.keybinds.copyNotes !== '' ? <Hotkeys keyName={window.keybinds.copyNotes} onKeyDown={() => this.copy()}/> : null}
      </span>
    );
  }
}
