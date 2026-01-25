import { memo, useRef, useEffect, useCallback } from 'react';

import './Textarea.scss';

const Textarea = memo(({ value, onChange, placeholder, minRows = 1, maxRows, className, style, readOnly }) => {
  const textareaRef = useRef(null);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';

    // Calculate line height
    const computedStyle = window.getComputedStyle(textarea);
    const lineHeight = parseInt(computedStyle.lineHeight) || 24;
    const paddingTop = parseInt(computedStyle.paddingTop) || 0;
    const paddingBottom = parseInt(computedStyle.paddingBottom) || 0;

    // Calculate min and max heights
    const minHeight = (minRows * lineHeight) + paddingTop + paddingBottom;
    const maxHeight = maxRows ? (maxRows * lineHeight) + paddingTop + paddingBottom : Infinity;

    // Set the height based on content, clamped between min and max
    const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
    textarea.style.height = `${newHeight}px`;
  }, [minRows, maxRows]);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  // Adjust on mount and window resize
  useEffect(() => {
    adjustHeight();
    window.addEventListener('resize', adjustHeight);
    return () => window.removeEventListener('resize', adjustHeight);
  }, [adjustHeight]);

  return (
    <textarea
      ref={textareaRef}
      className={`textarea-autosize${className ? ` ${className}` : ''}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={style}
      readOnly={readOnly}
      rows={minRows}
    />
  );
});

Textarea.displayName = 'Textarea';

export { Textarea as default, Textarea };
