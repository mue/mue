import { memo } from 'react';
import variables from 'config/variables';

function Lightbox({ modalClose, img }) {
  variables.stats.postEvent('modal', 'lightbox', 'opened');

  return (
    <>
      <span className="closeModal" onClick={modalClose}>
        &times;
      </span>
      <img src={img} className="lightboximg" draggable={false} alt="ItemPage screenshot" />
    </>
  );
}

const MemoizedLightbox = memo(Lightbox);
export { MemoizedLightbox as default, MemoizedLightbox as Lightbox };
