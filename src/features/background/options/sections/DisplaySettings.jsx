import { useT } from 'contexts';
import { Checkbox, Dropdown } from 'components/Form/Settings';
import { Row, Content, Action } from 'components/Layout/Settings/Item';
import { FREQUENCY_OPTIONS } from 'utils/frequencyManager';
import { clearQueuesOnSettingChange } from 'utils/queueOperations';

const DisplaySettings = ({ usingImage }) => {
  const t = useT();
  return (
    <>
      <Row>
        <Content
          title={t('modals.main.settings.sections.background.frequency.title')}
          subtitle={t('modals.main.settings.sections.background.frequency.subtitle')}
        />
        <Action>
          <Dropdown
            name="backgroundFrequency"
            label={t('modals.main.settings.sections.background.frequency.title')}
            onChange={(value) => {
              localStorage.setItem('backgroundStartTime', Date.now());
              const oldValue = localStorage.getItem('backgroundFrequency');
              if (oldValue === 'refresh' && value !== 'refresh') {
                clearQueuesOnSettingChange('backgroundFrequency');
              }
              window.dispatchEvent(
                new CustomEvent('frequencyChanged', {
                  detail: { type: 'background' },
                }),
              );
            }}
            items={FREQUENCY_OPTIONS.map((opt) => ({
              value: opt.value,
              text: t(opt.text),
            }))}
          />
        </Action>
      </Row>
      <Row final={true}>
        <Content
          title={t('modals.main.settings.sections.background.display')}
          subtitle={t('modals.main.settings.sections.background.display_subtitle')}
        />
        <Action>
          <Checkbox
            name="bgtransition"
            text={t('modals.main.settings.sections.background.transition')}
            element=".other"
            disabled={!usingImage}
          />
          <Checkbox
            name="photoInformation"
            text={t('modals.main.settings.sections.background.photo_information')}
            element=".other"
          />
          <Checkbox
            name="photoMap"
            text={t('modals.main.settings.sections.background.show_map')}
            element=".other"
            disabled={!usingImage}
          />
        </Action>
      </Row>
    </>
  );
};

export default DisplaySettings;
