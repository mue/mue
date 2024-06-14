import variables from 'config/variables';
import { useState } from 'react';
import { Field, Label, Switch as SwitchUI } from '@headlessui/react';

import EventBus from 'utils/eventbus';

function Switch(props) {
  const [checked, setChecked] = useState(localStorage.getItem(props.name) === 'true');

  const handleChange = () => {
    const value = checked !== true;
    localStorage.setItem(props.name, value);

    setChecked(value);

    if (props.onChange) {
      props.onChange(value);
    }

    variables.stats.postEvent(
      'setting',
      `${props.name} ${checked === true ? 'enabled' : 'disabled'}`,
    );

    if (props.element) {
      if (!document.querySelector(props.element)) {
        document.querySelector('.reminder-info').style.display = 'flex';
        return localStorage.setItem('showReminder', true);
      }
    }

    EventBus.emit('refresh', props.category);
  };

  return (
    <Field className="flex flex-row items-center justify-between w-[100%]">
      <Label>{props.header ? '' : props.text}</Label>
      <SwitchUI
        checked={checked}
        onChange={handleChange}
        className="box-border group relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
      >
        {' '}
        <span
          aria-hidden="true"
          className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
        />
      </SwitchUI>
    </Field>
  );
}

export { Switch as default, Switch };
