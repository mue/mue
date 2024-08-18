import variables from 'config/variables';
import { useEffect, useState } from 'react';
import { Checkbox as CheckboxUI, Field, Label } from '@headlessui/react';
import { MdCheckBox } from 'react-icons/md';
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

    variables.stats.postEvent('setting', `${props.name} ${value ? 'enabled' : 'disabled'}`);

    if (props.element) {
      if (!document.querySelector(props.element)) {
        document.querySelector('.reminder-info').style.display = 'flex';
        localStorage.setItem('showReminder', 'true');
      }
    }

    EventBus.emit('refresh', props.category);
  };

  return (
    <Field className="w-[300px] h-9 my-1 flex flex-row-reverse items-center gap-2 justify-between text-left">
      <CheckboxUI
        checked={checked}
        onChange={handleChange}
        disabled={props.disabled || false}
        className="border border-[#484848] bg-white/5 group size-4 rounded-sm data-[checked]:bg-neutral-900 cursor-pointer grid place-content-center"
      >
        <MdCheckBox className="stroke-white opacity-0 group-data-[checked]:opacity-100 size-6" />
      </CheckboxUI>
      <Label>{props.text}</Label>
    </Field>
  );
};

export { Checkbox as default, Checkbox };
