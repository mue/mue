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

const MARKER_COLORS = {
  light: '#555555',
  dark: '#2d3e5f',
};

const MARKER_BORDERS = {
  light: 'rgba(255, 255, 255, 0.95)',
  dark: 'rgba(255, 255, 255, 0.95)',
};

const getResolvedTheme = () => {
  const theme = localStorage.getItem('theme') || 'auto';
  if (theme === 'auto') {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  return theme === 'dark' ? 'dark' : 'light';
};

const createCircleMarker = (theme, compact) => {
  const markerElement = document.createElement('div');
  markerElement.className = `location-map-marker${compact ? ' location-map-marker--compact' : ''}`;
  markerElement.style.width = compact ? '8px' : '12px';
  markerElement.style.height = compact ? '8px' : '12px';
  markerElement.style.borderRadius = '50%';
  markerElement.style.borderStyle = 'solid';
  markerElement.style.borderWidth = compact ? '1.5px' : '2px';
  markerElement.style.boxShadow = compact ? '0 0 0 1px rgba(0, 0, 0, 0.2)' : '0 0 0 2px rgba(0, 0, 0, 0.2)';
  markerElement.style.opacity = compact && theme === 'light' ? '0.82' : '1';
  markerElement.style.backgroundColor = MARKER_COLORS[theme] || MARKER_COLORS.light;
  markerElement.style.borderColor = MARKER_BORDERS[theme] || MARKER_BORDERS.light;
  return markerElement;
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

    new maplibregl.Marker({
      element: createCircleMarker(resolvedTheme, compact),
      anchor: 'center',
    })
      .setLngLat([longitude, latitude])
      .addTo(mapInstance);

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
