import { useState, memo, useRef, useEffect } from 'react';
import { MdExpandMore, MdClose } from 'react-icons/md';

import './ChipSelect.scss';

function ChipSelect({ label, options, onChange }) {
  let start = (localStorage.getItem('apiCategories') || '').split(',');
  if (start[0] === '') {
    start = [];
  }

  const [optionsSelected, setOptionsSelected] = useState(start);
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

  const handleToggle = (optionName) => {
    let newSelected;
    if (optionsSelected.includes(optionName)) {
      newSelected = optionsSelected.filter((item) => item !== optionName);
    } else {
      newSelected = [...optionsSelected, optionName];
    }

    setOptionsSelected(newSelected);
    localStorage.setItem('apiCategories', newSelected.join(','));

    if (onChange) {
      onChange(newSelected);
    }
  };

  const handleRemoveChip = (e, optionName) => {
    e.stopPropagation();
    handleToggle(optionName);
  };

  return (
    <div className="chipSelect" ref={containerRef}>
      {label && <label className="chipSelect-label">{label}</label>}
      <div className="chipSelect-control" onClick={() => setIsOpen(!isOpen)}>
        <div className="chipSelect-value">
          {optionsSelected.length === 0 ? (
            <span className="chipSelect-placeholder">Select options...</span>
          ) : (
            <div className="chipSelect-chips">
              {optionsSelected.map((value) => (
                <span key={value} className="chipSelect-chip">
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                  <button
                    type="button"
                    className="chipSelect-chip-remove"
                    onClick={(e) => handleRemoveChip(e, value)}
                  >
                    <MdClose />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <MdExpandMore className={`chipSelect-arrow ${isOpen ? 'open' : ''}`} />
      </div>
      {isOpen && (
        <div className="chipSelect-dropdown">
          {options.map((option) => (
            <div
              key={option.name}
              className={`chipSelect-option ${optionsSelected.includes(option.name) ? 'selected' : ''}`}
              onClick={() => handleToggle(option.name)}
            >
              <span className="chipSelect-option-checkbox">
                {optionsSelected.includes(option.name) && '✓'}
              </span>
              <span className="chipSelect-option-label">
                {option.name.charAt(0).toUpperCase() + option.name.slice(1)}
                {option.count && ` (${option.count})`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const MemoizedChipSelect = memo(ChipSelect);
export { ChipSelect as default, MemoizedChipSelect as ChipSelect };
