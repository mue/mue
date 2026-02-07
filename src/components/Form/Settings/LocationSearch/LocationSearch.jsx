import { useT } from 'contexts';
import variables from 'config/variables';
import { memo, useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { MdExpandMore, MdCheck, MdClose, MdMyLocation } from 'react-icons/md';
import { useDebouncedCallback } from 'use-debounce';

import EventBus from 'utils/eventbus';

import './LocationSearch.scss';

const LocationSearch = memo((props) => {
  const { label, name, category, placeholder, disabled } = props;

  const [locationData, setLocationData] = useState(() => {
    const stored = localStorage.getItem(name);
    if (!stored) return null;

    try {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object' && parsed.displayName) {
        return parsed;
      }
    } catch {
      return { displayName: stored, legacy: true };
    }
    return null;
  });

  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });

  const containerRef = useRef(null);
  const controlRef = useRef(null);
  const menuRef = useRef(null);
  const searchInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  const closeDropdown = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
      setFocusedIndex(-1);
    }, 200);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Ignore clicks on color inputs to prevent closing when native color picker opens
      if (event.target.type === 'color') {
        return;
      }

      // Also ignore clicks on color input labels and wrappers
      const target = event.target;
      if (target.tagName === 'LABEL' && target.htmlFor) {
        const associatedInput =
          document.getElementById(target.htmlFor) ||
          document.querySelector(`input[name="${target.htmlFor}"]`);
        if (associatedInput && associatedInput.type === 'color') {
          return;
        }
      }

      // Check if clicking within a color input wrapper
      const colorInputWrapper = target.closest('.colour-picker');
      if (colorInputWrapper && colorInputWrapper.querySelector('input[type="color"]')) {
        return;
      }

      const t = useT();
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeDropdown]);

  const itemsCount = useMemo(() => suggestions.length, [suggestions]);

  const calculatePosition = useCallback(() => {
    if (controlRef.current) {
      const rect = controlRef.current.getBoundingClientRect();
      const gap = 4;
      const viewportHeight = window.innerHeight;
      const estimatedMenuHeight = Math.min(Math.max(itemsCount, 1) * 56, 250);
      const spaceBelow = viewportHeight - rect.bottom - gap;
      const spaceAbove = rect.top - gap;
      const shouldFlipUp = spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow;

      return {
        top: shouldFlipUp ? rect.top - gap : rect.bottom + gap,
        left: rect.left,
        width: rect.width,
        maxHeight: shouldFlipUp ? Math.min(250, spaceAbove) : Math.min(250, spaceBelow),
        flipped: shouldFlipUp,
      };
    }
    return { top: 0, left: 0, width: 0, maxHeight: 250, flipped: false };
  }, [itemsCount]);

  const openDropdown = useCallback(() => {
    const position = calculatePosition();
    setMenuPosition(position);
    setOpen(true);
  }, [calculatePosition]);

  useEffect(() => {
    if (!open) return;

    let rafId = null;
    const updatePosition = () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(() => {
        const newPosition = calculatePosition();
        setMenuPosition(newPosition);
      });
    };

    window.addEventListener('scroll', updatePosition, { passive: true });
    window.addEventListener('resize', updatePosition, { passive: true });

    let element = controlRef.current?.parentElement;
    const scrollableElements = [];
    while (element) {
      const hasScrollableContent = element.scrollHeight > element.clientHeight;
      const overflowYStyle = window.getComputedStyle(element).overflowY;
      const isOverflowYScrollable = overflowYStyle !== 'visible' && overflowYStyle !== 'hidden';

      if (hasScrollableContent && isOverflowYScrollable) {
        scrollableElements.push(element);
        element.addEventListener('scroll', updatePosition, { passive: true });
      }
      element = element.parentElement;
    }

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
      scrollableElements.forEach((el) => el.removeEventListener('scroll', updatePosition));
    };
  }, [open, calculatePosition]);

  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [open]);

  const debouncedSearch = useDebouncedCallback(async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(
        `${variables.constants.API_URL}/geocode?q=${encodeURIComponent(query)}`,
        { signal: abortControllerRef.current.signal },
      );

      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Location search error:', err);
        setSuggestions([]);
      }
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchQuery(value);
      setLoading(value.length >= 2);
      debouncedSearch(value);
      if (!open && value.length > 0) {
        openDropdown();
      }
    },
    [open, debouncedSearch, openDropdown],
  );

  const handleInputClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (!open) {
        openDropdown();
      }
    },
    [open, openDropdown],
  );

  const selectLocation = useCallback(
    (location) => {
      const locationObj = {
        name: location.name,
        displayName: location.displayName,
        lat: location.lat,
        lon: location.lon,
        country: location.country,
        state: location.state,
      };

      localStorage.setItem(name, JSON.stringify(locationObj));
      localStorage.removeItem('currentWeather');
      setLocationData(locationObj);
      setSearchQuery('');
      setSuggestions([]);
      closeDropdown();

      EventBus.emit('refresh', category);

      document.querySelector('.reminder-info').style.display = 'flex';
      localStorage.setItem('showReminder', true);
    },
    [name, category, closeDropdown],
  );

  const handleAutoLocation = useCallback(() => {
    setSearchQuery(t('modals.main.loading'));
    setSuggestions([]);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await (
            await fetch(
              `${variables.constants.API_URL}/gps?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`,
            )
          ).json();

          if (data && data[0]) {
            const loc = data[0];
            const locationObj = {
              name: loc.name,
              displayName: [loc.name, loc.state, loc.country].filter(Boolean).join(', '),
              lat: position.coords.latitude,
              lon: position.coords.longitude,
              country: loc.country,
              state: loc.state,
            };

            localStorage.setItem(name, JSON.stringify(locationObj));
            localStorage.removeItem('currentWeather');
            setLocationData(locationObj);
            setSearchQuery('');

            EventBus.emit('refresh', category);
            document.querySelector('.reminder-info').style.display = 'flex';
            localStorage.setItem('showReminder', true);
          }
        } catch (err) {
          console.error('Auto location error:', err);
          setSearchQuery('');
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setSearchQuery('');
      },
      { enableHighAccuracy: true },
    );
  }, [name, category]);

  const handleKeyDown = useCallback(
    (e) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          if (open && suggestions.length > 0) {
            // Select focused item, or first item if nothing is focused
            const indexToSelect = focusedIndex >= 0 ? focusedIndex : 0;
            selectLocation(suggestions[indexToSelect]);
          }
          break;
        case 'Escape':
          if (searchQuery) {
            setSearchQuery('');
            setSuggestions([]);
          } else {
            closeDropdown();
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!open && searchQuery.length >= 2) {
            openDropdown();
          } else {
            setFocusedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (open) {
            setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          }
          break;
      }
    },
    [
      open,
      suggestions,
      focusedIndex,
      disabled,
      searchQuery,
      openDropdown,
      closeDropdown,
      selectLocation,
    ],
  );

  const clearSearch = useCallback((e) => {
    e.stopPropagation();
    setSearchQuery('');
    setSuggestions([]);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const id = 'location-search-' + name;
  const displayValue = locationData?.displayName || placeholder || 'Search location...';

  return (
    <div
      className={`location-search ${id} ${disabled ? 'disabled' : ''}`}
      ref={containerRef}
      onClick={(e) => e.stopPropagation()}
    >
      {label && (
        <div className="location-search-header">
          <label className="location-search-label">{label}</label>
          <span className="location-search-auto" onClick={handleAutoLocation}>
            <MdMyLocation />
            {t('modals.main.settings.sections.weather.auto')}
          </span>
        </div>
      )}
      <div
        ref={controlRef}
        className={`location-search-control ${open || searchQuery ? 'searching' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          if (disabled) return;
          if (!open) {
            openDropdown();
          }
        }}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label || name}
        tabIndex={disabled ? -1 : 0}
      >
        <input
          ref={searchInputRef}
          type="text"
          className="location-search-input"
          placeholder={displayValue}
          value={searchQuery}
          onChange={handleSearchChange}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
        />
        {searchQuery && <MdClose className="location-search-clear" onClick={clearSearch} />}
        {loading ? (
          <span className="location-search-loading" />
        ) : (
          <MdExpandMore className={`location-search-arrow ${open ? 'open' : ''}`} />
        )}
      </div>
      {(open || closing) &&
        createPortal(
          <div
            ref={menuRef}
            className={`location-search-menu ${closing ? 'closing' : ''} ${menuPosition.flipped ? 'flipped' : ''}`}
            role="listbox"
            style={{
              position: 'fixed',
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              width: `${menuPosition.width}px`,
              maxHeight: menuPosition.maxHeight ? `${menuPosition.maxHeight}px` : '250px',
              transform: menuPosition.flipped ? 'translateY(-100%)' : 'none',
            }}
          >
            {suggestions.length > 0 ? (
              suggestions.map((item, index) => (
                <div
                  key={`${item.lat}-${item.lon}`}
                  className={`location-search-option ${index === focusedIndex ? 'focused' : ''}`}
                  onClick={() => selectLocation(item)}
                  role="option"
                  tabIndex={0}
                >
                  <span className="location-search-option-text">
                    <span className="location-search-option-name">{item.name}</span>
                    {(item.state || item.country) && (
                      <span className="location-search-option-detail">
                        {[item.state, item.country].filter(Boolean).join(', ')}
                      </span>
                    )}
                  </span>
                  <MdCheck className="location-search-option-check" />
                </div>
              ))
            ) : searchQuery.length >= 2 && !loading ? (
              <div className="location-search-empty">{t('widgets.weather.not_found')}</div>
            ) : searchQuery.length < 2 && searchQuery.length > 0 ? (
              <div className="location-search-empty">
                {t('modals.main.settings.sections.weather.location')}...
              </div>
            ) : null}
          </div>,
          document.body,
        )}
    </div>
  );
});

LocationSearch.displayName = 'LocationSearch';

export { LocationSearch as default, LocationSearch };
