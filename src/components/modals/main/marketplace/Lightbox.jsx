import { memo } from 'react';
import variables from 'modules/variables';

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

export default memo(Lightbox);