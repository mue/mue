import React from 'react';

export default function ResetModal(props) {
  return (
    <div className='welcomeContent'>
      <span className='closeModal' onClick={props.modalClose}>&times;</span>
      <div className='welcomeModalText'>
        reset text
        <button className='close' onClick={props.modalClose}>yes</button>
        <button className='close' onClick={props.modalClose}>no</button>
      </div>
    </div>
  );
}
