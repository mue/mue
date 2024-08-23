import variables from 'config/variables';
import { useState } from 'react';
import ColorPicker from 'react-best-gradient-color-picker';
import { toast } from 'react-toastify';
import { Row, Content, Action } from 'components/Layout/Settings/Item';
import { MdRefresh } from 'react-icons/md';
import defaults from './default';

import '../scss/_colourpicker.scss';

const ColourOptions = () => {
  const [colour, setColour] = useState(
    localStorage.getItem('customBackgroundColour') || defaults.customBackgroundColour,
  );

  const changeColour = (output) => {
    setColour(output);
    localStorage.setItem('customBackgroundColour', output);
    showReminder();
  };

  const resetColour = () => {
    setColour('rgba(0, 0, 0, 0)');
    localStorage.setItem('customBackgroundColour', 'rgba(0, 0, 0, 0)');
    toast(variables.getMessage('toasts.reset'));
    showReminder();
  };

  const showReminder = () => {
    const reminderInfo = document.querySelector('.reminder-info');
    if (reminderInfo.style.display !== 'block') {
      reminderInfo.style.display = 'block';
      localStorage.setItem('showReminder', true);
    }
  };

  return (
    <Row final={true}>
      <Content title={variables.getMessage('settings:sections.background.source.custom_colour')} />
      <Action>
        <ColorPicker
          value={colour}
          onChange={changeColour}
          hideEyeDrop={true}
          hideColorGuide={true}
          hidePresets={true}
          height={147}
        />
        <div className="colourReset">
          <span className="link" onClick={() => resetColour()}>
            <MdRefresh />
            {variables.getMessage('settings:buttons.reset')}
          </span>
        </div>
      </Action>
    </Row>
  );
};

export { ColourOptions as default, ColourOptions };
