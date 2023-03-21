import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import { MdOutlineArrowForwardIos, MdOutlineArrowBackIos } from 'react-icons/md';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

import './carousel.scss';

function EmblaCarousel({ data }) {
  const autoplay = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false }, (emblaRoot) => emblaRoot.parentElement),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false }, [autoplay.current]);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scroll = useCallback(
    (direction) => {
      if (!emblaApi) {
        return;
      }

      if (direction === 'next') {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollPrev();
      }
      autoplay.current.reset();
    },
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) {
      return;
    }
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }
    onSelect();
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="carousel">
      <div className="carousel_viewport" ref={emblaRef}>
        <div className="carousel_container">
          {data.map((photo, index) => (
            <div className="carousel_slide" key={index}>
              <div className="carousel_slide_inner">
                <img src={photo.url.default} alt="Marketplace example screenshot" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        className="carousel_button prev"
        onClick={() => scroll('prev')}
        disabled={!prevBtnEnabled}
      >
        <MdOutlineArrowBackIos />
      </button>
      <button
        className="carousel_button next"
        onClick={() => scroll('next')}
        disabled={!nextBtnEnabled}
      >
        <MdOutlineArrowForwardIos />
      </button>
    </div>
  );
}

EmblaCarousel.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default memo(EmblaCarousel);
