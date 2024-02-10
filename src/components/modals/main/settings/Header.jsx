import variables from 'modules/variables';
import { useState, useEffect } from 'react';
import {
  MdFlag,
  MdOutlineVisibilityOff,
  MdOutlineVisibility,
  MdOutlineKeyboardArrowRight,
} from 'react-icons/md';
import EventBus from 'modules/helpers/eventbus';
import Button from './Button';

export const CustomActions = ({ children }) => {
  return children;
};

export default function Header(props) {
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
        label={variables.getMessage('modals.main.settings.sections.header.report_issue')}
      />
    );
  };

  return (
    <>
      <div className="modalHeader">
        <span className="mainTitle">
          {props.secondaryTitle && (
            <>
              <span className="backTitle" onClick={props.goBack}>
                {props.title}
              </span>
              <MdOutlineKeyboardArrowRight />
            </>
          )}
          {props.secondaryTitle || props.title}
        </span>
        <div className="headerActions">
          {props.visibilityToggle && <VisibilityToggle />}
          {props.report !== false && <ReportButton />}
          {props.children}
        </div>
      </div>
    </>
  );
}

// Remove the export statement for customActions
// export { customActions };
