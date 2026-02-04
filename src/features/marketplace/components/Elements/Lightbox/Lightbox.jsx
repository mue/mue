import { memo } from 'react';
import { useT } from 'contexts';
import variables from 'config/variables';
import { getProxiedImageUrl } from 'utils/marketplace';

function Lightbox({ modalClose, img }) {
  const t = useT();
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
        alt={t('common.alt_text.screenshot')}
      />
    </>
  );
}

const MemoizedLightbox = memo(Lightbox);
export { MemoizedLightbox as default, MemoizedLightbox as Lightbox };
