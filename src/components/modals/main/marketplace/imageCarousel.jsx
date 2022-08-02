import React, { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

export default function EmbaleCarousel({ data }) {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay()]);

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        {data.map((photo, index) => (
          <div className="embla__slide" key={index}>
            <img src={photo.url.default} />
          </div>
        ))}
      </div>
    </div>
  );
}
