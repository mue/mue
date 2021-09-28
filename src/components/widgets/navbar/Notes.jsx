import variables from 'modules/variables';
import { PureComponent } from 'react';
import { FileCopyRounded, AssignmentRounded as NotesRounded, PushPin }from '@mui/icons-material';
import TextareaAutosize from '@mui/material/TextareaAutosize';
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
    variables.stats.postEvent('feature', 'Notes pin');

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
    variables.stats.postEvent('feature', 'Notes copied');
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
        {variables.keybinds.pinNotes && variables.keybinds.pinNotes !== '' ? <Hotkeys keyName={variables.keybinds.pinNotes} onKeyDown={() => this.pin()}/> : null}
        {variables.keybinds.copyNotes && variables.keybinds.copyNotes !== '' ? <Hotkeys keyName={variables.keybinds.copyNotes} onKeyDown={() => this.copy()}/> : null}
      </span>
    );
  }
}
