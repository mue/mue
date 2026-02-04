import { useT } from 'contexts';
import { useState } from 'react';
import ColorPicker from 'react-best-gradient-color-picker';
import { toast } from 'react-toastify';
import { Row, Content, Action } from 'components/Layout/Settings/Item';
import { MdRefresh } from 'react-icons/md';
import EventBus from 'utils/eventbus';

import '../scss/_colourpicker.scss';

const ColourOptions = () => {
  const t = useT();
  const [colour, setColour] = useState(
    localStorage.getItem('customBackgroundColour') || 'rgba(0, 0, 0, 100)',
  );

  const changeColour = (output) => {
    setColour(output);
    localStorage.setItem('customBackgroundColour', output);
    EventBus.emit('refresh', 'background');
  };

  const resetColour = () => {
    setColour('rgba(0, 0, 0, 0)');
    localStorage.setItem('customBackgroundColour', 'rgba(0, 0, 0, 100)');
    toast(t('toasts.reset'));
    EventBus.emit('refresh', 'background');
  };

  return (
    <Row final={true}>
      <Content title={t('modals.main.settings.sections.background.source.custom_colour')} />
      <Action>
        <ColorPicker
          value={colour}
          onChange={changeColour}
          hideEyeDrop={true}
          hideColorGuide={true}
          hidePresets={true}
          hideAdvancedSliders={false}
          hideColorTypeBtns={false}
          hideInputType={false}
          height={147}
        />
        <div className="colourReset">
          <span className="link" onClick={() => resetColour()}>
            <MdRefresh />
            {t('modals.main.settings.buttons.reset')}
          </span>
        </div>
      </Action>
    </Row>
  );
};

export { ColourOptions as default, ColourOptions };
