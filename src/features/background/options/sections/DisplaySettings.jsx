import variables from 'config/variables';
import { Checkbox, Dropdown } from 'components/Form/Settings';
import { Row, Content, Action } from 'components/Layout/Settings/Item';
import { FREQUENCY_OPTIONS } from 'utils/frequencyManager';
import { clearQueuesOnSettingChange } from 'utils/queueOperations';

const DisplaySettings = ({ usingImage }) => {
  return (
    <>
      <Row>
        <Content
          title={variables.getMessage('modals.main.settings.sections.background.frequency.title')}
          subtitle={variables.getMessage(
            'modals.main.settings.sections.background.frequency.subtitle',
          )}
        />
        <Action>
          <Dropdown
            name="backgroundFrequency"
            label={variables.getMessage('modals.main.settings.sections.background.frequency.title')}
            onChange={(value) => {
              localStorage.setItem('backgroundStartTime', Date.now());
              // Clear queue if switching from refresh to time-based frequency
              const oldValue = localStorage.getItem('backgroundFrequency');
              if (oldValue === 'refresh' && value !== 'refresh') {
                clearQueuesOnSettingChange('backgroundFrequency');
              }
              // Notify the frequency interval hook that the frequency changed
              window.dispatchEvent(new CustomEvent('frequencyChanged', {
                detail: { type: 'background' }
              }));
            }}
            items={FREQUENCY_OPTIONS.map((opt) => ({
              value: opt.value,
              text: variables.getMessage(opt.text),
            }))}
          />
        </Action>
      </Row>
      <Row final={true}>
        <Content
          title={variables.getMessage('modals.main.settings.sections.background.display')}
          subtitle={variables.getMessage(
            'modals.main.settings.sections.background.display_subtitle',
          )}
        />
        <Action>
          <Checkbox
            name="bgtransition"
            text={variables.getMessage('modals.main.settings.sections.background.transition')}
            element=".other"
            disabled={!usingImage}
          />
          <Checkbox
            name="photoInformation"
            text={variables.getMessage('modals.main.settings.sections.background.photo_information')}
            element=".other"
          />
          <Checkbox
            name="photoMap"
            text={variables.getMessage('modals.main.settings.sections.background.show_map')}
            element=".other"
            disabled={!usingImage}
          />
        </Action>
      </Row>
    </>
  );
};

export default DisplaySettings;
