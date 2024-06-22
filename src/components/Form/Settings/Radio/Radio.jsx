import variables from 'config/variables';
import { useState } from 'react';
import { Radio as PureRadio, RadioGroup } from '@headlessui/react';
import { MdCheckCircle } from 'react-icons/md';

import EventBus from 'utils/eventbus';

function Radio(props) {
  const [value, setValue] = useState(localStorage.getItem(props.name));

  const handleChange = async (value) => {
    if (value === 'loading') {
      return;
    }

    if (props.name === 'language') {
      // old tab name
      // TODO: was this important?
      // if (localStorage.getItem('tabName') === variables.getMessage('tabname')) {
      //   localStorage.setItem('tabName', translations[value].tabname);
      // }
    }

    localStorage.setItem(props.name, value);

    setValue(value);

    if (props.onChange) {
      props.onChange(value);
    }

    variables.stats.postEvent('setting', `${props.name} from ${value} to ${value}`);

    if (props.element) {
      if (!document.querySelector(props.element)) {
        document.querySelector('.reminder-info').style.display = 'flex';
        return localStorage.setItem('showReminder', true);
      }
    }

    EventBus.emit('refresh', props.category);
  };

  return (
    <div className="w-full">
      <RadioGroup
        aria-label={props.name}
        name={props.name}
        onChange={handleChange}
        value={value}
        className="space-y-2"
      >
        {props.options.map((option) => (
          <PureRadio
            key={option.name}
            label={option.name}
            value={option.value}
            className="data-[checked]:bg-white/10 group relative flex cursor-pointer rounded-lg bg-white/5 data-[checked]:hover:bg-neutral-700 hover:bg-neutral-700 py-4 px-5 text-white shadow-md transition focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white"
          >
            <div className="flex w-full items-center justify-between">
              <div className="text-sm/6">
                <p className="font-semibold text-white capitalize">{option.name}</p>
                <div className="flex gap-2 text-white/50">
                  <div>{option.subname}</div>
                  <div aria-hidden="true">&middot;</div>
                  <div>10%</div>
                </div>
              </div>
              <MdCheckCircle className="size-6 fill-white opacity-0 transition group-data-[checked]:opacity-100" />
            </div>
          </PureRadio>
        ))}
      </RadioGroup>
    </div>
  );
}

export { Radio as default, Radio };
