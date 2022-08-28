import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MdOutlineArrowForwardIos, MdOutlineArrowBackIos } from 'react-icons/md';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

import './carousel.scss';

export default function EmblaCarousel({ data }) {
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
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {data.map((photo, index) => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__inner">
                <img
                  className="embla__slide__img"
                  src={photo.url.default}
                  alt="Marketplace example screenshot"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        className="embla__button embla__button--prev"
        onClick={() => scroll('prev')}
        disabled={!prevBtnEnabled}
        title="Previous"
      >
        <MdOutlineArrowBackIos />
      </button>
      <button
        className="embla__button embla__button--next"
        onClick={() => scroll('next')}
        disabled={!nextBtnEnabled}
        title="Next"
      >
        <MdOutlineArrowForwardIos />
      </button>
    </div>
  );
}
