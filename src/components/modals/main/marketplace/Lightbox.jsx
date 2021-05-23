import React from 'react';

export default function Lightbox(props) {
  return (
    <>
      <span className='closeModal' onClick={props.modalClose}>&times;</span>
      <img src={props.img} className='lightboximg' draggable={false} alt='Item screenshot'/>
    </>
  );
}
