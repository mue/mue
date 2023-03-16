import { memo } from 'react';
import PropTypes from 'prop-types';
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

Lightbox.propTypes = {
  modalClose: PropTypes.func.isRequired,
  img: PropTypes.string.isRequired,
};

export default memo(Lightbox);
