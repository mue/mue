import React from 'react';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import CopyIcon from '@material-ui/icons/FileCopyRounded';
import Pin from './icons/Pin';
import NotesIcon from '@material-ui/icons/AssignmentRounded';

export default class Notes extends React.PureComponent {
    constructor(...args) {
        super(...args);
        this.state = {
            notes: localStorage.getItem('notes') || ''
        };
    }

    setNotes = (e) => {
        localStorage.setItem('notes', e.target.value);
        this.setState({ notes: e.target.value });
    };

    pin() {
        document.getElementById('noteContainer').classList.toggle('visibilityshow');
        (localStorage.getItem('notesPinned') === 'true') ? localStorage.setItem('notesPinned', false) : localStorage.setItem('notesPinned', true);
    }

    componentDidMount() {
        if (localStorage.getItem('notesPinned') === 'true') document.getElementById('noteContainer').classList.toggle('visibilityshow');
    }

    render() {
        return (
            <span id='noteContainer' className='notescontainer'>
                <div className='topbarnotes'>
                    <NotesIcon/>
                    <h3>{this.props.language.title}</h3>
                </div>
                <TextareaAutosize rowsMax={50} placeholder={this.props.language.placeholder} value={this.state.notes} onChange={this.setNotes}/>
                <button onClick={this.pin} className='pinNote'><Pin/></button>
                <button onClick={() => navigator.clipboard.writeText(this.state.notes)} className='saveNote'><CopyIcon/></button>
            </span>
        );
    }
}
