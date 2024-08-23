import variables from 'config/variables';
import { useState, useEffect } from 'react';
import EventBus from 'utils/eventbus';
import { Button } from 'components/Elements';
import { MdFlag, MdOutlineVisibilityOff, MdOutlineVisibility } from 'react-icons/md';
import Slider from '../../../Form/Settings/Slider/Slider';
import values from 'utils/data/slider_values.json';

const Preview = (props) => {
  return (
    <div className="h-full">
      <h1 className="py-3 uppercase tracking-tight text-neutral-300">Preview</h1>
      <div className="bg-modal-content-light dark:bg-modal-content-dark p-10 rounded">
        {props.children}
      </div>
    </div>
  );
};

const Controls = (props) => {
  const [setting, setSetting] = useState(localStorage.getItem(props.setting) === 'true');

  useEffect(() => {
    setSetting(localStorage.getItem(props.setting) === 'true');
  }, [props.setting]);

  const changeSetting = () => {
    const toggle = localStorage.getItem(props.setting) === 'true';
    localStorage.setItem(props.setting, !toggle);
    setSetting(!toggle);

    variables.stats.postEvent(
      'setting',
      `${props.name} ${setting === true ? 'enabled' : 'disabled'}`,
    );

    EventBus.emit('toggle', props.setting);

    if (props.element) {
      if (!document.querySelector(props.element)) {
        document.querySelector('.reminder-info').style.display = 'flex';
        return localStorage.setItem('showReminder', true);
      }
    }

    EventBus.emit('refresh', props.category);
  };

  const VisibilityToggle = () => (
    <Button
      type="settings"
      onClick={changeSetting}
      icon={setting ? <MdOutlineVisibilityOff /> : <MdOutlineVisibility />}
      label={setting ? 'Hide' : 'Show'}
    />
  );

  const ReportButton = () => {
    return (
      <Button
        type="settings"
        onClick={() =>
          window.open(variables.constants.BUG_REPORT + props.title.split(' ').join('+'), '_blank')
        }
        icon={<MdFlag />}
        label={variables.getMessage('settings:sections.header.report_issue')}
      />
    );
  };

  return (
    <div className="h-full">
      <h1 className="py-3 uppercase tracking-tight text-neutral-300">Controls</h1>
      <div className="bg-modal-content-light dark:bg-modal-content-dark p-10 rounded flex flex-col gap-10">
        {props.visibilityToggle && <VisibilityToggle />}
        {props.report !== false && <ReportButton />}
        {(props.zoomSetting !== null || props.zoomSetting !== '') && (
          <Slider
            name={props.zoomSetting}
            min="10"
            max="400"
            default="100"
            display="%"
            marks={values.zoom}
            category={props.zoomCategory || props.category}
          />
        )}
      </div>
    </div>
  );
};

const Hero = (props) => {
  return (
    <div className="grid grid-cols-2 w-full rounded gap-10 auto-rows-[1fr]">{props.children}</div>
  );
};

export { Hero, Preview, Controls };
