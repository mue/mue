import { useEffect, useRef, useState } from 'react';
import { useT } from 'contexts';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import variables from 'config/variables';

const MAP_STYLES = {
  light: 'https://tiles.openfreemap.org/styles/liberty',
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
};
const STANDARD_ZOOM = 9;
const COMPACT_ZOOM = 1.2;
const COUNTRY_ZOOM_PADDING = 5;
const COUNTRY_BOUNDS_CACHE = new Map();

const getResolvedTheme = () => {
  const theme = localStorage.getItem('theme') || 'auto';
  if (theme === 'auto') {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  return theme === 'dark' ? 'dark' : 'light';
};

const hideCompactMapLabels = (mapInstance) => {
  const layers = mapInstance.getStyle()?.layers || [];
  layers.forEach((layer) => {
    if (layer.type === 'symbol') {
      mapInstance.setLayoutProperty(layer.id, 'visibility', 'none');
    }
  });
};

const parseBoundingBox = (boundingbox) => {
  if (!Array.isArray(boundingbox) || boundingbox.length !== 4) {
    return null;
  }

  const [south, north, west, east] = boundingbox.map(Number);
  if ([south, north, west, east].some(Number.isNaN)) {
    return null;
  }

  return [
    [west, south],
    [east, north],
  ];
};

const fetchCountryBounds = async (latitude, longitude, signal) => {
  const reverseUrl = new URL('https://nominatim.openstreetmap.org/reverse');
  reverseUrl.searchParams.set('format', 'jsonv2');
  reverseUrl.searchParams.set('lat', String(latitude));
  reverseUrl.searchParams.set('lon', String(longitude));
  reverseUrl.searchParams.set('zoom', '3');
  reverseUrl.searchParams.set('addressdetails', '1');

  const response = await fetch(reverseUrl.toString(), {
    signal,
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const countryCode = data?.address?.country_code?.toUpperCase();
  if (countryCode && COUNTRY_BOUNDS_CACHE.has(countryCode)) {
    return COUNTRY_BOUNDS_CACHE.get(countryCode);
  }

  const bounds = parseBoundingBox(data?.boundingbox);
  if (countryCode && bounds) {
    COUNTRY_BOUNDS_CACHE.set(countryCode, bounds);
  }

  return bounds;
};

function LocationMap({ latitude, longitude, compact = false }) {
  const t = useT();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [resolvedTheme, setResolvedTheme] = useState(getResolvedTheme);
  const [compactCountryBounds, setCompactCountryBounds] = useState(null);

  useEffect(() => {
    const updateTheme = () => {
      setResolvedTheme(getResolvedTheme());
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => {
      if (localStorage.getItem('theme') === 'auto') {
        updateTheme();
      }
    };

    updateTheme();
    mediaQuery.addEventListener('change', handleMediaChange);

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!compact) {
      setCompactCountryBounds(null);
      return undefined;
    }

    const abortController = new AbortController();
    let isCancelled = false;

    const loadCountryBounds = async () => {
      try {
        const bounds = await fetchCountryBounds(latitude, longitude, abortController.signal);
        if (!isCancelled) {
          setCompactCountryBounds(bounds);
        }
      } catch (error) {
        if (!isCancelled) {
          setCompactCountryBounds(null);
        }
      }
    };

    loadCountryBounds();

    return () => {
      isCancelled = true;
      abortController.abort();
    };
  }, [compact, latitude, longitude]);

  useEffect(() => {
    if (!mapContainer.current) return undefined;

    map.current?.remove();

    const mapInstance = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLES[resolvedTheme] || MAP_STYLES.light,
      center: [longitude, latitude],
      zoom: compact ? COMPACT_ZOOM : STANDARD_ZOOM,
      interactive: false,
      attributionControl: false,
    });

    map.current = mapInstance;

    mapInstance.once('load', () => {
      if (compact) {
        hideCompactMapLabels(mapInstance);
      }

      if (compact && compactCountryBounds) {
        const countryCamera = mapInstance.cameraForBounds(compactCountryBounds, {
          padding: COUNTRY_ZOOM_PADDING,
          maxZoom: 3.2,
        });

        if (countryCamera && typeof countryCamera.zoom === 'number') {
          mapInstance.jumpTo({
            center: [longitude, latitude],
            zoom: countryCamera.zoom,
          });
          return;
        }
      }

      mapInstance.jumpTo({
        center: [longitude, latitude],
        zoom: compact ? COMPACT_ZOOM : STANDARD_ZOOM,
      });
    });

    return () => {
      mapInstance.remove();
      if (map.current === mapInstance) {
        map.current = null;
      }
    };
  }, [compact, compactCountryBounds, latitude, longitude, resolvedTheme]);

  return (
    <div className={`location-map-section${compact ? ' location-map-section--compact' : ''}`}>
      <a
        href={`${variables.constants.OPENSTREETMAP_URL}/?mlat=${latitude}&mlon=${longitude}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div
          ref={mapContainer}
          className={`location-map-container${compact ? ' location-map-container--compact' : ''}`}
          aria-label={t('common.alt_text.location')}
        />
      </a>
      {!compact && (
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
      )}
    </div>
  );
}

export default LocationMap;
