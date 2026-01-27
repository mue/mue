import variables from 'config/variables';
import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MdExpandMore, MdCheck, MdRefresh } from 'react-icons/md';
import { toast } from 'react-toastify';

import EventBus from 'utils/eventbus';

import './Dropdown.scss';

const Dropdown = memo((props) => {
  const [value, setValue] = useState(localStorage.getItem(props.name) || props.items[0]?.value);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef(null);
  const controlRef = useRef(null);
  const menuRef = useRef(null);
  const optionsRef = useRef([]);

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

  const calculatePosition = useCallback(() => {
    if (controlRef.current) {
      const rect = controlRef.current.getBoundingClientRect();
      const gap = 4;
      const viewportHeight = window.innerHeight;

      // Estimate menu height (will be more accurate after first render)
      const estimatedMenuHeight = Math.min(props.items.filter((i) => i !== null).length * 44, 250);

      // Calculate if dropdown would overflow bottom of viewport
      const spaceBelow = viewportHeight - rect.bottom - gap;
      const spaceAbove = rect.top - gap;

      // If not enough space below but more space above, flip to top
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
  }, [props.items]);

  const openDropdown = useCallback(() => {
    const position = calculatePosition();
    setMenuPosition(position);
    setIsOpen(true);
  }, [calculatePosition]);

  const onChange = useCallback(
    (newValue) => {
      if (newValue === variables.getMessage('modals.main.loading')) {
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
          document.querySelector('.reminder-info').style.display = 'flex';
          return localStorage.setItem('showReminder', true);
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
          if (isOpen) {
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
          if (!isOpen) {
            openDropdown();
          } else {
            setFocusedIndex((prev) =>
              prev < props.items.filter((i) => i !== null).length - 1 ? prev + 1 : prev,
            );
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (isOpen) {
            setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          }
          break;
      }
    },
    [isOpen, props.items, props.disabled, openDropdown, closeDropdown],
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

  const resetItem = useCallback(() => {
    const defaultValue = props.default || props.items[0]?.value;
    onChange(defaultValue);
    toast(variables.getMessage('toasts.reset'));
  }, [onChange, props.default, props.items]);

  const id = 'dropdown' + props.name;
  const label = props.label || '';
  const selectedItem = props.items.find((item) => item?.value === value);

  return (
    <div className={`dropdown ${id} ${props.disabled ? 'disabled' : ''}`} ref={containerRef}>
      {label && (
        <div className="dropdown-header">
          <label className="dropdown-label">{label}</label>
          <span className="dropdown-reset" onClick={resetItem}>
            <MdRefresh />
            {variables.getMessage('modals.main.settings.buttons.reset')}
          </span>
        </div>
      )}
      <div
        ref={controlRef}
        className="dropdown-control"
        onClick={() => {
          if (props.disabled) return;
          if (isOpen) {
            closeDropdown();
          } else {
            openDropdown();
          }
        }}
        onKeyDown={handleKeyDown}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={label || props.name}
        tabIndex={props.disabled ? -1 : 0}
      >
        <span className="dropdown-value">{selectedItem?.text || value}</span>
        <MdExpandMore className={`dropdown-arrow ${isOpen ? 'open' : ''}`} />
      </div>
      {(isOpen || isClosing) &&
        createPortal(
          <div
            ref={menuRef}
            className={`dropdown-menu ${isClosing ? 'closing' : ''} ${menuPosition.flipped ? 'flipped' : ''}`}
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
            {props.items.map((item, index) =>
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
                  <span className="dropdown-option-text">{item.text}</span>
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
