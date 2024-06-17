import variables from 'config/variables';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Field, Label, Textarea, Input } from '@headlessui/react';
import { MdRefresh } from 'react-icons/md';

import clsx from 'clsx';

import EventBus from 'utils/eventbus';

function Text(props) {
  const [value, setValue] = useState(localStorage.getItem(props.name) || '');

  const handleChange = (e) => {
    let { value } = e.target;

    // Alex wanted font to work with montserrat and Montserrat, so I made it work
    if (props.upperCaseFirst === true) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }

    localStorage.setItem(props.name, value);
    setValue(value);

    if (props.element) {
      if (!document.querySelector(props.element)) {
        document.querySelector('.reminder-info').style.display = 'flex';
        return localStorage.setItem('showReminder', true);
      }
    }

    EventBus.emit('refresh', props.category);
  };

  const resetItem = () => {
    handleChange({
      target: {
        value: props.default || '',
      },
    });
    toast(variables.getMessage('toasts.reset'));
  };

  return (
    <Field className="w-full">
      <div className="w-full flex flex-row justify-between items-center">
        <Label>{props.title}</Label>
        <span className="link" onClick={resetItem}>
          <MdRefresh />
          {variables.getMessage('settings:buttons.reset')}
        </span>
      </div>
      {props.textarea === true ? (
        <>
          <Textarea
            value={value}
            onChange={handleChange}
            className={clsx(
              'bg-white/5 box-border mt-3 block w-full resize-none rounded-lg py-1.5 px-3 text-sm/6 text-white border border-[#484848]',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
            )}
            rows={4}
          />
        </>
      ) : (
        <>
          <Input
            value={value}
            onChange={handleChange}
            placeholder={props.placeholder || ''}
            className={clsx(
              'box-border mt-3 block w-full rounded-lg bg-white/5 py-1.5 px-3 text-sm/6 text-white border border-[#484848]',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
            )}
          />
        </>
      )}
    </Field>
  );
}

export { Text as default, Text };
