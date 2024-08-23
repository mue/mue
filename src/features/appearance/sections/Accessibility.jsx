import variables from 'config/variables';
import { Checkbox, Dropdown, Slider } from 'components/Form/Settings';
import values from 'utils/data/slider_values.json';
import { Row, Content, Action } from 'components/Layout/Settings';

const AccessibilityOptions = () => {
  return (
    <Row final={true}>
      <Content
        title={variables.getMessage('settings:sections.appearance.accessibility.title')}
        subtitle={variables.getMessage('settings:sections.appearance.accessibility.description')}
      />
      <Action>
        <Dropdown
          label={variables.getMessage(
            'settings:sections.appearance.accessibility.text_shadow.title',
          )}
          name="textBorder"
          category="other"
          items={[
            {
              value: 'new',
              text: variables.getMessage(
                'settings:sections.appearance.accessibility.text_shadow.new',
              ),
            },
            {
              value: 'true',
              text: variables.getMessage(
                'settings:sections.appearance.accessibility.text_shadow.old',
              ),
            },
            {
              value: 'none',
              text: variables.getMessage(
                'settings:sections.appearance.accessibility.text_shadow.none',
              ),
            },
          ]}
        />
        <Checkbox
          text={variables.getMessage('settings:sections.appearance.accessibility.animations')}
          name="animations"
          category="other"
        />
        <Slider
          title={variables.getMessage('settings:sections.appearance.accessibility.toast_duration')}
          name="toastDisplayTime"
          default="2500"
          step="100"
          min="500"
          max="5000"
          marks={values.toast}
          display={
            ' ' + variables.getMessage('settings:sections.appearance.accessibility.milliseconds')
          }
        />
      </Action>
    </Row>
  );
};

export { AccessibilityOptions as default, AccessibilityOptions };
