import React from 'react';

export default function FeedbackModal(props) {
    return (
        <div className='feedback'>
          <h1>{props.language.modals.feedback.title}</h1>
          <span className='closeModal' onClick={props.modalClose}>&times;</span>
           <label>{props.language.modals.feedback.question_one}</label>
           <br/><br/>
           <label className='values'>0</label><input className='range' type='range' min='0' max='100' /><label className='values'>10</label>
           <br/><br/>
           <label>{props.language.modals.feedback.question_two}</label>
           <br/><br/>
           <input type='text'/>
           <br/><br/>
           <label>{props.language.modals.feedback.question_three}</label>
           <br/><br/>
           <label className='values'>0</label><input className='range' type='range' min='0' max='100' /><label className='values'>10</label>
           <br/><br/><br/>
           <button>{props.language.modals.feedback.submit}</button>
       </div>
    );
}