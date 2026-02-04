import { useT } from 'contexts';
import { useState, memo } from 'react';
import { Checkbox, Slider } from 'components/Form/Settings';
import { Button } from 'components/Elements';
import { toast } from 'react-toastify';

import EventBus from 'utils/eventbus';
import values from 'utils/data/slider_values.json';

import { Row, Content, Action } from 'components/Layout/Settings/Item';

function ExperimentalOptions() {
  const t = useT();
  const [eventType, setEventType] = useState();
  const [eventName, setEventName] = useState();

  return (
    <>
      <span className="mainTitle">{t('modals.main.settings.sections.experimental.title')}</span>
      <span className="subtitle">{t('modals.main.settings.sections.experimental.warning')}</span>
      <Row>
        <Content title={t('modals.main.settings.sections.experimental.developer')} />
        <Action>
          <Checkbox
            name="debug"
            text={t('modals.main.settings.sections.experimental.debug_hotkey')}
            element=".other"
          />
          <Slider
            title={t('modals.main.settings.sections.experimental.debug_timeout')}
            name="debugtimeout"
            min="0"
            max="5000"
            default="0"
            step="100"
            marks={values.experimental}
            element=".other"
          />
          <p style={{ textAlign: 'left', width: '100%' }}>
            {t('modals.main.settings.sections.experimental.send_event')}
          </p>
          <div className="text-field">
            <label className="text-field-label">
              {t('modals.main.settings.sections.experimental.event_type')}
            </label>
            <input
              type="text"
              className="text-field-input"
              value={eventType || ''}
              onChange={(e) => setEventType(e.target.value)}
              spellCheck={false}
            />
          </div>
          <div className="text-field">
            <label className="text-field-label">
              {t('modals.main.settings.sections.experimental.event_name')}
            </label>
            <input
              type="text"
              className="text-field-input"
              value={eventName || ''}
              onChange={(e) => setEventName(e.target.value)}
              spellCheck={false}
            />
          </div>
          <Button
            type="settings"
            onClick={() => EventBus.emit(eventType, eventName)}
            label={t('common.actions.send')}
          />
          <Button
            type="settings"
            onClick={() => toast(t('modals.main.settings.sections.experimental.toast_success'))}
            label={t('modals.main.settings.sections.experimental.normal_toast')}
          />
          <Button
            type="settings"
            onClick={() =>
              toast.success(t('modals.main.settings.sections.experimental.toast_success'))
            }
            label={t('modals.main.settings.sections.experimental.achievement_toast')}
          />
        </Action>
      </Row>
      <Row final={true}>
        <Content title={t('modals.main.settings.sections.experimental.data_section')} />
        <Action>
          <Button
            type="settings"
            onClick={() => localStorage.clear()}
            label={t('modals.main.settings.sections.experimental.clear_localstorage')}
          />
        </Action>
      </Row>
    </>
  );
}

const MemoizedExperimentalOptions = memo(ExperimentalOptions);
export {
  MemoizedExperimentalOptions as default,
  MemoizedExperimentalOptions as ExperimentalOptions,
};
