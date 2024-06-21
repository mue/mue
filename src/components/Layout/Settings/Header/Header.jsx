import variables from 'config/variables';
import { useState, useEffect } from 'react';
import {
  MdFlag,
  MdOutlineVisibilityOff,
  MdOutlineVisibility,
} from 'react-icons/md';
import EventBus from 'utils/eventbus';
import { Button } from 'components/Elements';

export const CustomActions = ({ children }) => {
  return children;
};

function Header(props) {
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
    <div className="modalHeader">
      <div className="headerActions">
        {props.visibilityToggle && <VisibilityToggle />}
        {props.report !== false && <ReportButton />}
        {props.children}
      </div>
    </div>
  );
}

export { Header as default, Header };
