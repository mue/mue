import React from 'react';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import CopyIcon from '@material-ui/icons/FileCopyRounded';
import Pin from './icons/Pin';
import NotesIcon from '@material-ui/icons/AssignmentRounded';

export default class Notes extends React.PureComponent {
    constructor(...args) {
        super(...args);
        this.state = {
            notes: localStorage.getItem('notes') || ""
        };
    }

    setNotes = (e) => {
        localStorage.setItem('notes', e.target.value);
        this.setState({ notes: e.target.value });
    };

    pin() {
        const pinned = localStorage.getItem('notesPinned');
        document.getElementById('noteContainer').classList.toggle('visibilityshow');
        if (pinned === 'true') localStorage.setItem('notesPinned', false);
        else localStorage.setItem('notesPinned', true);
    }

    componentDidMount() {
        if (localStorage.getItem('notesPinned') === 'true') document.getElementById('noteContainer').classList.toggle('visibilityshow');
    }

    render() {
        const copyNotes = () => navigator.clipboard.writeText(this.state.notes);

        return (
            <span id='noteContainer' className='notescontainer'>
                <div className='topbarnotes'>
                    <NotesIcon/>
                    <h3>Notes</h3>
                </div>
                <TextareaAutosize rowsMax={50} placeholder='Enter Notes' value={this.state.notes} onChange={this.setNotes}/>
                <button onClick={this.pin} className='pinNote'><Pin/></button>
                <button onClick={copyNotes} className='saveNote'><CopyIcon/></button>
            </span>
        );
    }
}
