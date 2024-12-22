import { useState } from 'react';
import { Field, Label, Select } from '@headlessui/react';
import clsx from 'clsx';

import EventBus from 'utils/eventbus';
import variables from 'config/variables';

const Dropdown = (props) => {
  const [value, setValue] = useState(localStorage.getItem(props.name) || props.items[0]?.value);

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (newValue === variables.getMessage('modals.main.loading')) {
      return;
    }

    variables.stats.postEvent('setting', `${props.name} from ${value} to ${newValue}`);
    setValue(newValue);

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
  };

  const selectedItem = props.items.find((item) => item?.value === value);

  return (
    <Field className="w-[100%] max-w-md mr-10">
      {props.label && <Label className="mb-2 block text-sm font-medium">{props.label}</Label>}
      <div className="relative">
        <Select
          name={props.name}
          value={value}
          onChange={handleChange}
          aria-label={props.label || props.name}
          className={clsx(
            'w-full rounded-lg py-4 px-5 text-sm/6 font-semibold text-white shadow-md',
            'bg-white/5 hover:bg-white/10 dark:text-white',
            'border border-white/10',
            'transition-colors duration-200',
            'focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white',
            'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
            'appearance-none',
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='white' class='w-6 h-6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 1.25rem center',
            backgroundSize: '1rem',
          }}
        >
          {props.items.map((item) =>
            item !== null ? (
              <option
                key={item.value}
                value={item.value}
                className="bg-modal-content-light dark:bg-modal-content-dark"
              >
                {item.text}
              </option>
            ) : null,
          )}
        </Select>
      </div>
      {selectedItem?.description && (
        <p className="mt-2 text-sm text-white/50">{selectedItem.description}</p>
      )}
    </Field>
  );
};

export { Dropdown as default, Dropdown };
