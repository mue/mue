import { useEffect, useRef } from 'react';
import { useT } from 'contexts';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import variables from 'config/variables';

function LocationMap({ latitude, longitude }) {
  const t = useT();
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [longitude, latitude],
      zoom: 9,
      interactive: false,
      attributionControl: false,
    });

    new maplibregl.Marker({ color: '#555555' })
      .setLngLat([longitude, latitude])
      .addTo(map.current);

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [latitude, longitude]);

  return (
    <div className="location-map-section">
      <a
        href={`${variables.constants.OPENSTREETMAP_URL}/?mlat=${latitude}&mlon=${longitude}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div
          ref={mapContainer}
          className="location-map-container"
          aria-label={t('common.alt_text.location')}
        />
      </a>
      <div className="map-copyright">
        <a href="https://openfreemap.org" target="_blank" rel="noopener noreferrer">
          © OpenFreeMap
        </a>
        {' • '}
        <a href="https://www.openmaptiles.org/" target="_blank" rel="noopener noreferrer">
          © OpenMapTiles
        </a>
        {' • '}
        <a href="https://www.openstreetmap.org/about/" target="_blank" rel="noopener noreferrer">
          © OpenStreetMap
        </a>
      </div>
    </div>
  );
}

export default LocationMap;
