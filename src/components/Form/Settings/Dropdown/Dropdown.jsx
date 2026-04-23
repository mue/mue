import { useT } from 'contexts';
import variables from 'config/variables';
import { memo, useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { MdExpandMore, MdCheck, MdRefresh, MdClose } from 'react-icons/md';
import { toast } from 'react-toastify';

import EventBus from 'utils/eventbus';

import './Dropdown.scss';

const Dropdown = memo((props) => {
  const t = useT();
  const [value, setValue] = useState(localStorage.getItem(props.name) || props.items[0]?.value);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const controlRef = useRef(null);
  const menuRef = useRef(null);
  const optionsRef = useRef([]);
  const searchInputRef = useRef(null);

  const closeDropdown = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
      setFocusedIndex(-1);
      setSearchQuery('');
    }, 200);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      setFocusedIndex(-1);
    }, 200); // Match animation duration
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
        const associatedInput = document.getElementById(target.htmlFor) || document.querySelector(`input[name="${target.htmlFor}"]`);
        if (associatedInput && associatedInput.type === 'color') {
          return;
        }
      }

      // Check if clicking within a color input wrapper
      const colorInputWrapper = target.closest('.colour-picker');
      if (colorInputWrapper && colorInputWrapper.querySelector('input[type="color"]')) {
        return;
      }

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

  const itemsCount = useMemo(() => props.items.filter((i) => i !== null).length, [props.items]);

  const calculatePosition = useCallback(() => {
    if (controlRef.current) {
      const rect = controlRef.current.getBoundingClientRect();
      const gap = 4;
      const viewportHeight = window.innerHeight;

      const estimatedMenuHeight = Math.min(itemsCount * 44, 250);

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
    if (open && props.searchable && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [open, props.searchable]);

  const handleSearchChange = useCallback(
    (e) => {
      setSearchQuery(e.target.value);
      if (!open) {
        openDropdown();
      }
    },
    [open, openDropdown],
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

  const handleInputFocus = useCallback(() => {
    const defaultValue = props.default || props.items[0]?.value;
    if (value !== defaultValue && !searchQuery) {
      const currentItem = props.items.find((item) => item?.value === value);
      const currentText = currentItem?.text || value;
      setSearchQuery(currentText);
    }
  }, [value, props.default, props.items, searchQuery]);

  const onChange = useCallback(
    (newValue) => {
      if (newValue === t('modals.main.loading')) {
        return;
      }

      variables.stats.postEvent('setting', `${props.name} from ${value} to ${newValue}`);

      setValue(newValue);
      closeDropdown();

      if (!props.noSetting) {
        localStorage.setItem(props.name, newValue);
        localStorage.setItem(props.name2, props.value2);
      }

      if (props.onChange) {
        props.onChange(newValue);
      }

      if (props.element) {
        if (!document.querySelector(props.element)) {
          localStorage.setItem('showReminder', 'true');
          EventBus.emit('showReminder');
          return;
        }
      }

      EventBus.emit('refresh', props.category);
    },
    [value, props],
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (props.disabled) return;

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (open) {
            closeDropdown();
          } else {
            openDropdown();
          }
          break;
        case 'Escape':
          closeDropdown();
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!open) {
            openDropdown();
          } else {
            setFocusedIndex((prev) =>
              prev < props.items.filter((i) => i !== null).length - 1 ? prev + 1 : prev,
            );
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
    [open, props.items, props.disabled, openDropdown, closeDropdown],
  );

  const handleOptionKeyDown = useCallback(
    (e, item) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onChange(item.value);
      }
    },
    [onChange],
  );

  const resetItem = useCallback(
    (e) => {
      e?.stopPropagation();
      const defaultValue = props.default || props.items[0]?.value;
      onChange(defaultValue);
      toast(t('toasts.reset'));
    },
    [onChange, props.default, props.items],
  );

  const clearSearch = useCallback(
    (e) => {
      e.stopPropagation();
      setSearchQuery('');
      if (props.searchable) {
        const defaultValue = props.default || props.items[0]?.value;
        onChange(defaultValue);
      }
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    },
    [props, onChange],
  );

  const id = 'dropdown' + props.name;
  const label = props.label || '';
  const selectedItem = props.items.find((item) => item?.value === value);
  const defaultValue = props.default || props.items[0]?.value;

  const filteredItems =
    props.searchable && searchQuery
      ? props.items.filter(
          (item) => item !== null && item.text.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : props.items;

  return (
    <div
      className={`dropdown ${id} ${props.disabled ? 'disabled' : ''}`}
      ref={containerRef}
      onClick={(e) => e.stopPropagation()}
    >
      {label && (
        <div className="dropdown-header">
          <label className="dropdown-label">{label}</label>
          <span className="dropdown-reset" onClick={resetItem}>
            <MdRefresh />
            {t('modals.main.settings.buttons.reset')}
          </span>
        </div>
      )}
      <div
        ref={controlRef}
        className={`dropdown-control ${props.searchable && (open || searchQuery) ? 'searching' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          if (props.disabled) return;
          if (open) {
            closeDropdown();
          } else {
            openDropdown();
          }
        }}
        onKeyDown={handleKeyDown}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label || props.name}
        tabIndex={props.disabled ? -1 : 0}
      >
        {props.searchable ? (
          <>
            <input
              ref={searchInputRef}
              type="text"
              className="dropdown-search-input-control"
              placeholder={selectedItem?.text || value}
              value={searchQuery}
              onChange={handleSearchChange}
              onClick={handleInputClick}
              onFocus={handleInputFocus}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  if (searchQuery) {
                    setSearchQuery('');
                  } else {
                    closeDropdown();
                  }
                }
                if (e.key === ' ') {
                  e.stopPropagation();
                }
              }}
            />
            {(searchQuery || value !== (props.default || props.items[0]?.value)) && (
              <MdClose className="dropdown-clear" onClick={clearSearch} />
            )}
          </>
        ) : (
          <span className="dropdown-value">{selectedItem?.text || value}</span>
        )}
        <MdExpandMore className={`dropdown-arrow ${open ? 'open' : ''}`} />
      </div>
      {(open || closing) &&
        createPortal(
          <div
            ref={menuRef}
            className={`dropdown-menu ${closing ? 'closing' : ''} ${menuPosition.flipped ? 'flipped' : ''}`}
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
            {filteredItems.map((item, index) =>
              item !== null ? (
                <div
                  key={id + item.value}
                  ref={(el) => (optionsRef.current[index] = el)}
                  className={`dropdown-option ${value === item.value ? 'selected' : ''} ${index === focusedIndex ? 'focused' : ''}`}
                  onClick={() => onChange(item.value)}
                  onKeyDown={(e) => handleOptionKeyDown(e, item)}
                  role="option"
                  aria-selected={value === item.value}
                  tabIndex={0}
                >
                  <span className="dropdown-option-text">
                    {item.text}
                    {item.value === defaultValue && (
                      <span className="dropdown-option-default">
                        {' '}
                        ({t('modals.main.settings.buttons.default')})
                      </span>
                    )}
                  </span>
                  {value === item.value && <MdCheck className="dropdown-option-check" />}
                </div>
              ) : null,
            )}
          </div>,
          document.body,
        )}
    </div>
  );
});

Dropdown.displayName = 'Dropdown';

export { Dropdown as default, Dropdown };
