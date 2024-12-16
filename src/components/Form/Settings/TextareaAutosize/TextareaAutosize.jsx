import { useEffect, useRef } from 'react';

const TextareaAutosize = ({
  value,
  onChange,
  placeholder,
  minRows = 1,
  maxRows = 10,
  className = '',
  style = {},
  disabled = false,
  error = false,
  id,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
}) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const resizeTextarea = () => {
      textarea.style.height = 'auto';
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
      const minHeight = lineHeight * minRows;
      const maxHeight = lineHeight * maxRows;
      const newHeight = Math.max(minHeight, Math.min(textarea.scrollHeight, maxHeight));
      textarea.style.height = `${newHeight}px`;
    };

    resizeTextarea();
  }, [value, minRows, maxRows]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      id={id}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      aria-invalid={error}
      className={`
        resize-none
        overflow-hidden
        w-full
        bg-transparent
        border-0 
        border-b
        border-gray-200
        hover:border-gray-300
        focus:border-blue-500
        focus:ring-0
        outline-none
        transition-colors
        text-sm
        p-5
        ${disabled ? 'text-gray-500 cursor-not-allowed' : 'text-gray-900'}
        ${error ? 'border-red-500' : ''}
        ${className}
      `}
      style={{
        padding: '10px',
        ...style,
      }}
    />
  );
};

export { TextareaAutosize, TextareaAutosize as default };
