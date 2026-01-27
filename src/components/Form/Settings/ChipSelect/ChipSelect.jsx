import { useState, memo, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MdExpandMore, MdClose, MdCheck } from 'react-icons/md';

import './ChipSelect.scss';

function ChipSelect({ label, options, onChange }) {
  let start = (localStorage.getItem('apiCategories') || '').split(',');
  if (start[0] === '') {
    start = [];
  }

  const [optionsSelected, setOptionsSelected] = useState(start);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef(null);
  const controlRef = useRef(null);
  const menuRef = useRef(null);

  const closeDropdown = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
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

      // Estimate menu height
      const estimatedMenuHeight = Math.min(options.length * 44, 250);

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
  }, [options]);

  const openDropdown = useCallback(() => {
    const position = calculatePosition();
    setMenuPosition(position);
    setIsOpen(true);
  }, [calculatePosition]);

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
      <div
        ref={controlRef}
        className="chipSelect-control"
        onClick={() => {
          if (isOpen) {
            closeDropdown();
          } else {
            openDropdown();
          }
        }}
      >
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
      {(isOpen || isClosing) &&
        createPortal(
          <div
            ref={menuRef}
            className={`chipSelect-dropdown ${isClosing ? 'closing' : ''} ${menuPosition.flipped ? 'flipped' : ''}`}
            style={{
              position: 'fixed',
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              width: `${menuPosition.width}px`,
              maxHeight: menuPosition.maxHeight ? `${menuPosition.maxHeight}px` : '250px',
              transform: menuPosition.flipped ? 'translateY(-100%)' : 'none',
            }}
          >
            {options.map((option) => (
              <div
                key={option.name}
                className={`chipSelect-option ${optionsSelected.includes(option.name) ? 'selected' : ''}`}
                onClick={() => handleToggle(option.name)}
              >
                <div className="chipSelect-option-checkbox">
                  {optionsSelected.includes(option.name) && <MdCheck />}
                </div>
                <span className="chipSelect-option-label">
                  {option.name.charAt(0).toUpperCase() + option.name.slice(1)}
                  {option.count && ` (${option.count})`}
                </span>
              </div>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}

const MemoizedChipSelect = memo(ChipSelect);
export { ChipSelect as default, MemoizedChipSelect as ChipSelect };
