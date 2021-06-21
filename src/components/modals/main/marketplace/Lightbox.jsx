export default function Lightbox(props) {
  window.analytics.postEvent('modalUpdate', 'Lightbox used');

  return (
    <>
      <span className='closeModal' onClick={props.modalClose}>&times;</span>
      <img src={props.img} className='lightboximg' draggable={false} alt='Item screenshot'/>
    </>
  );
}
