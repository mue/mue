import { Field, Label, Select } from '@headlessui/react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import clsx from 'clsx';
import { useEffect, useState, useRef } from 'react';

import EventBus from 'utils/eventbus';
import variables from 'config/variables';

const Dropdown = (props) => {
  const [value, setValue] = useState(localStorage.getItem(props.name) || props.items[0]?.value);
  const dropdown = useRef(null);

  useEffect(() => {
    setValue(localStorage.getItem(props.name) || props.items[0]?.value);
  }, [props.name]);

  const onChange = (e) => {
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

  const id = 'dropdown' + props.name;
  const label = props.label || '';

  return (
    <div className="w-[100%] max-w-md">
      <Field
        id={props.name}
        value={value}
        label={label}
        onChange={onChange}
        ref={dropdown}
        key={id}
      >
        <Label
          id={props.name}
          value={value}
          label={label}
          onChange={onChange}
          ref={dropdown}
          key={id}
        >
          {label}
        </Label>
        <div className="relative">
          <Select
            className={clsx(
              'mt-3 border border-[#484848] block w-full appearance-none rounded-lg bg-white/5 py-1.5 px-3 text-sm/6 text-white',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
              '*:text-black box-border',
            )}
            value={value}
            onChange={onChange}
          >
            {props.items.map((item) =>
              item !== null ? (
                <option key={id + item.value} value={item.value}>
                  {item.text}
                </option>
              ) : null,
            )}
          </Select>
          <MdKeyboardArrowDown className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60" />
        </div>
      </Field>
    </div>
  );
};

export { Dropdown as default, Dropdown };
