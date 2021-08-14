import { PureComponent } from 'react';

import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import CopyIcon from '@material-ui/icons/FileCopyRounded';
import NotesIcon from '@material-ui/icons/AssignmentRounded';
import Pin from '@material-ui/icons/PushPin';

import { toast } from 'react-toastify';

export default class Notes extends PureComponent {
  constructor() {
    super();
    this.state = {
      notes: localStorage.getItem('notes') || '',
      visibility: (localStorage.getItem('notesPinned') === 'true') ? 'visible' : 'hidden'
    };
    this.language = window.language.widgets.navbar.notes;
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
    toast(window.language.toasts.notes);
  }

  componentDidMount() {
    if (localStorage.getItem('refresh') === 'false') {
      document.getElementById('noteContainer').style.marginLeft = '-200px';
    }
  }

  render() {
    return (
      <span id='noteContainer' className='notescontainer' style={{ visibility: this.state.visibility }}>
        <div className='topbarnotes'>
          <NotesIcon/>
          <h3>{this.language.title}</h3>
        </div>
        <TextareaAutosize rowsmax={50} placeholder={this.language.placeholder} value={this.state.notes} onChange={this.setNotes}/>
        <button onClick={() => this.pin()} className='pinNote'><Pin/></button>
        <button onClick={() => this.copy()} className='copyNote'><CopyIcon/></button>
      </span>
    );
  }
}
