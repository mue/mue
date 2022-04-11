import variables from 'modules/variables';

export default function Lightbox({ modalClose, img }) {
  variables.stats.postEvent('modal', 'Opened lightbox');

  return (
    <>
      <span className="closeModal" onClick={modalClose}>
        &times;
      </span>
      <img src={img} className="lightboximg" draggable={false} alt="Item screenshot" />
    </>
  );
}
