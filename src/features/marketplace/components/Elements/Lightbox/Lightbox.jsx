import { memo } from 'react';
import variables from 'config/variables';
import { getProxiedImageUrl } from 'utils/marketplace';

function Lightbox({ modalClose, img }) {
  variables.stats.postEvent('modal', 'Opened lightbox');

  return (
    <>
      <span className="closeModal" onClick={modalClose}>
        &times;
      </span>
      <img
        src={getProxiedImageUrl(img)}
        className="lightboximg"
        draggable={false}
        alt={variables.getMessage('common.alt_text.screenshot')}
      />
    </>
  );
}

const MemoizedLightbox = memo(Lightbox);
export { MemoizedLightbox as default, MemoizedLightbox as Lightbox };
