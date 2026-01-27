import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MdExpandMore, MdChevronLeft, MdChevronRight } from 'react-icons/md';

import './DatePicker.scss';

const DatePicker = memo((props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const [viewDate, setViewDate] = useState(props.value || new Date());
  const containerRef = useRef(null);
  const controlRef = useRef(null);
  const menuRef = useRef(null);

  const closeDropdown = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200);
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
      const estimatedMenuHeight = 320;
      const spaceBelow = viewportHeight - rect.bottom - gap;
      const spaceAbove = rect.top - gap;
      const shouldFlipUp = spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow;

      return {
        top: shouldFlipUp ? rect.top - gap : rect.bottom + gap,
        left: rect.left,
        width: rect.width,
        maxHeight: shouldFlipUp ? Math.min(320, spaceAbove) : Math.min(320, spaceBelow),
        flipped: shouldFlipUp,
      };
    }
    return { top: 0, left: 0, width: 0, maxHeight: 320, flipped: false };
  }, []);

  const openDropdown = useCallback(() => {
    const position = calculatePosition();
    setMenuPosition(position);
    setIsOpen(true);
  }, [calculatePosition]);

  const formatDate = (date) => {
    if (!date) return 'Select Date';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return props.hideYear ? `${month}/${day}` : `${month}/${day}/${year}`;
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateSelect = (day) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    if (props.onChange) {
      props.onChange(newDate);
    }
    closeDropdown();
  };

  const handlePreviousMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(viewDate);
    const firstDay = getFirstDayOfMonth(viewDate);
    const days = [];
    const today = new Date();
    const selectedDate = props.value;

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDateSelect(day)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="datepicker" ref={containerRef} onClick={(e) => e.stopPropagation()}>
      <div
        ref={controlRef}
        className="datepicker-control"
        onClick={() => {
          if (isOpen) {
            closeDropdown();
          } else {
            openDropdown();
          }
        }}
      >
        <span className="datepicker-value">{formatDate(props.value)}</span>
        <MdExpandMore className={`datepicker-arrow ${isOpen ? 'open' : ''}`} />
      </div>
      {(isOpen || isClosing) &&
        createPortal(
          <div
            ref={menuRef}
            className={`datepicker-menu ${isClosing ? 'closing' : ''} ${menuPosition.flipped ? 'flipped' : ''}`}
            style={{
              position: 'fixed',
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              transform: menuPosition.flipped ? 'translateY(-100%)' : 'none',
            }}
          >
            <div className="calendar-header">
              <button onClick={handlePreviousMonth} className="calendar-nav">
                <MdChevronLeft />
              </button>
              <span className="calendar-month">
                {monthNames[viewDate.getMonth()]}{props.hideYear ? '' : ` ${viewDate.getFullYear()}`}
              </span>
              <button onClick={handleNextMonth} className="calendar-nav">
                <MdChevronRight />
              </button>
            </div>
            <div className="calendar-weekdays">
              <div>Su</div>
              <div>Mo</div>
              <div>Tu</div>
              <div>We</div>
              <div>Th</div>
              <div>Fr</div>
              <div>Sa</div>
            </div>
            <div className="calendar-grid">
              {renderCalendar()}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';

export { DatePicker as default, DatePicker };
