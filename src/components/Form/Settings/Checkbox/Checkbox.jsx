import variables from 'config/variables';
import { useEffect, useState } from 'react';
import { Checkbox as CheckboxUI, Field, Label } from '@headlessui/react';
import EventBus from 'utils/eventbus';

const Checkbox = (props) => {
  const [checked, setChecked] = useState(localStorage.getItem(props.name) === 'true');

  useEffect(() => {
    setChecked(localStorage.getItem(props.name) === 'true');
  }, [props.name]);

  const handleChange = () => {
    const value = !checked;
    localStorage.setItem(props.name, value.toString());

    setChecked(value);

    if (props.onChange) {
      props.onChange(value);
    }

    variables.stats.postEvent(
      'setting',
      `${props.name} ${value ? 'enabled' : 'disabled'}`,
    );

    if (props.element) {
      if (!document.querySelector(props.element)) {
        document.querySelector('.reminder-info').style.display = 'flex';
        localStorage.setItem('showReminder', 'true');
      }
    }

    EventBus.emit('refresh', props.category);
  };

  return (
    <Field className="flex flex-row-reverse items-center gap-2">
      <CheckboxUI
        checked={checked}
        onChange={handleChange}
        disabled={props.disabled || false}
        className="group block size-4 rounded border bg-white data-[checked]:bg-blue-500"
      >
        <svg
          className="stroke-white opacity-0 group-data-[checked]:opacity-100"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M3 8L6 11L11 3.5"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </CheckboxUI>
      <Label>{props.text}</Label>
    </Field>
  );
};

export { Checkbox as default, Checkbox };