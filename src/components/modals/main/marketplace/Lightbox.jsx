export default function Lightbox(props) {
  window.stats.postEvent('modal', 'Opened lightbox');

  return (
    <>
      <span className='closeModal' onClick={props.modalClose}>&times;</span>
      <img src={props.img} className='lightboximg' draggable={false} alt='Item screenshot'/>
    </>
  );
}
