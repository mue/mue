import variables from 'config/variables';
import { useState, useEffect, useMemo } from 'react';
import EventBus from 'utils/eventbus';
import { Button } from 'components/Elements';
import { MdFlag, MdOutlineVisibilityOff, MdOutlineVisibility } from 'react-icons/md';
import Slider from '../../../Form/Settings/Slider/Slider';
import values from 'utils/data/slider_values.json';
import { motion, AnimatePresence } from 'framer-motion';

const Preview = (props) => {
  return (
    <div className="h-full flex flex-col">
      <h1 className="py-3 uppercase tracking-tight text-neutral-300">Preview</h1>
      <div className="bg-modal-content-light dark:bg-modal-content-dark p-10 rounded flex-grow">
        <div className="relative w-full h-[300px] bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-lg overflow-hidden grid place-items-center">
          {props.children}
        </div>
      </div>
    </div>
  );
};

const VisibilityToggleButton = ({ setting, onClick }) => {
  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    setIsInitialRender(false);
  }, []);

  const iconVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <button
      type="button"
      className="bg-modal-content-light hover:bg-[#e5e5e5] active:bg-[#d5d5d5] 
                 dark:bg-modal-content-dark dark:hover:bg-[#565656] dark:active:bg-[#464646] 
                 p-10 rounded flex flex-col gap-2 
                 transition-all ease-in-out duration-700 
                 focus:outline-none focus:ring-2 focus:ring-offset-2 
                 focus:ring-blue-600 dark:focus:ring-blue-400
                 focus:ring-offset-white dark:focus:ring-offset-gray-900"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-checked={setting}
      aria-label={setting ? 'Hide content' : 'Show content'}
      role="switch"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={setting ? 'hide' : 'show'}
          variants={iconVariants}
          initial={prefersReducedMotion ? 'animate' : 'initial'}
          animate="animate"
          exit={prefersReducedMotion ? 'animate' : 'exit'}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          className="text-2xl text-gray-900 dark:text-gray-100"
          aria-hidden="true"
        >
          {setting ? <MdOutlineVisibilityOff /> : <MdOutlineVisibility />}
        </motion.span>
      </AnimatePresence>
      <motion.span
        initial={isInitialRender ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: isInitialRender ? 0 : prefersReducedMotion ? 0 : 0.2 }}
        className="text-base text-gray-900 dark:text-gray-100"
      >
        {setting ? 'Hide' : 'Show'}
      </motion.span>
    </button>
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

    variables.stats.postEvent('setting', props.name, setting === true ? 'enabled' : 'disabled');

    EventBus.emit('toggle', props.setting);

    if (props.element) {
      if (!document.querySelector(props.element)) {
        document.querySelector('.reminder-info').style.display = 'flex';
        return localStorage.setItem('showReminder', true);
      }
    }

    EventBus.emit('refresh', props.category);
  };

  const ReportButton = () => {
    return (
      <button
        type="button"
        className="bg-modal-content-light hover:bg-[#e5e5e5] active:bg-[#d5d5d5] 
        dark:bg-modal-content-dark dark:hover:bg-[#565656] dark:active:bg-[#464646] 
        p-10 rounded flex flex-col gap-2 
        transition-all ease-in-out duration-700 
        focus:outline-none focus:ring-2 focus:ring-offset-2 
        focus:ring-blue-600 dark:focus:ring-blue-400
        focus:ring-offset-white dark:focus:ring-offset-gray-900"
        onClick={() =>
          window.open(variables.constants.BUG_REPORT + props.title.split(' ').join('+'), '_blank')
        }
        aria-label={`Report an issue with ${props.title}`}
      >
        <span className="text-2xl" aria-hidden="true">
          <MdFlag />
        </span>
        <span className="text-base capitalize">
          {variables.getMessage('settings:sections.header.report_issue')}
        </span>
      </button>
    );
  };

  const memoizedToggle = useMemo(
    () => <VisibilityToggleButton setting={setting} onClick={changeSetting} />,
    [setting, changeSetting],
  );

  return (
    <div className="h-full flex flex-col">
      <h1 className="py-3 uppercase tracking-tight text-neutral-300">Controls</h1>
      <div className="grid grid-cols-2 gap-5 mb-5">
        {props.visibilityToggle && memoizedToggle}
        {props.report !== false && <ReportButton />}
      </div>
      <div className="bg-modal-content-light dark:bg-modal-content-dark p-10 rounded flex items-center jutify-center flex-grow">
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
    <div className="grid grid-cols-2 w-full rounded gap-3 auto-rows-[1fr]">{props.children}</div>
  );
};

export { Hero, Preview, Controls };
