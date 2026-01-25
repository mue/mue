import variables from 'config/variables';
import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { MdExpandMore, MdCheck, MdRefresh } from 'react-icons/md';
import { toast } from 'react-toastify';

import EventBus from 'utils/eventbus';

import './Dropdown.scss';

const Dropdown = memo((props) => {
  const [value, setValue] = useState(
    localStorage.getItem(props.name) || props.items[0]?.value,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef(null);
  const optionsRef = useRef([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onChange = useCallback(
    (newValue) => {
      if (newValue === variables.getMessage('modals.main.loading')) {
        return;
      }

      variables.stats.postEvent('setting', `${props.name} from ${value} to ${newValue}`);

      setValue(newValue);
      setIsOpen(false);
      setFocusedIndex(-1);

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
          setIsOpen(!isOpen);
          break;
        case 'Escape':
          setIsOpen(false);
          setFocusedIndex(-1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setFocusedIndex((prev) => (prev < props.items.filter((i) => i !== null).length - 1 ? prev + 1 : prev));
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
    [isOpen, props.items, props.disabled],
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
        className="dropdown-control"
        onClick={() => !props.disabled && setIsOpen(!isOpen)}
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
      {isOpen && (
        <div className="dropdown-menu" role="listbox">
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
        </div>
      )}
    </div>
  );
});

Dropdown.displayName = 'Dropdown';

export { Dropdown as default, Dropdown };
