import variables from 'config/variables';
import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { MdExpandMore } from 'react-icons/md';

import EventBus from 'utils/eventbus';

import './Dropdown.scss';

const Dropdown = memo((props) => {
  const [value, setValue] = useState(
    localStorage.getItem(props.name) || props.items[0]?.value,
  );
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
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

  const id = 'dropdown' + props.name;
  const label = props.label || '';
  const selectedItem = props.items.find((item) => item?.value === value);

  return (
    <div className={`dropdown ${id}`} ref={containerRef}>
      {label && <label className="dropdown-label">{label}</label>}
      <div className="dropdown-control" onClick={() => setIsOpen(!isOpen)}>
        <span className="dropdown-value">{selectedItem?.text || value}</span>
        <MdExpandMore className={`dropdown-arrow ${isOpen ? 'open' : ''}`} />
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          {props.items.map((item) =>
            item !== null ? (
              <div
                key={id + item.value}
                className={`dropdown-option ${value === item.value ? 'selected' : ''}`}
                onClick={() => onChange(item.value)}
              >
                {item.text}
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
