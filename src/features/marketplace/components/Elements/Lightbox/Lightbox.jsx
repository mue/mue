import { memo } from 'react';
import variables from 'config/variables';

function Lightbox({ modalClose, img }) {
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

const MemoizedLightbox = memo(Lightbox);
export { MemoizedLightbox as default, MemoizedLightbox as Lightbox };
