import React from 'react';

import './reminder.scss';

import { MdClose, MdSnooze, MdWork } from 'react-icons/md';

export default class Reminder extends React.PureComponent {
    render() {
        return (
                <div className='reminder'>
                    <div className='identifier' style={{ backgroundColor: localStorage.getItem('reminderColour') || 'orange' }}>
                        <MdWork />
                    </div>
                    <div className='content'>
                        <span className='title'>Reminder</span>
                        <span className='subtitle'>Time</span>
                    </div>
                    <div className='icons'>
                        <MdClose />
                        <MdSnooze />
                    </div>
                </div>
        )
    }
}