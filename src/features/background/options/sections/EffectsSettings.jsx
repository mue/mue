import variables from 'config/variables';
import { Dropdown, Slider } from 'components/Form/Settings';
import { Row, Content, Action } from 'components/Layout/Settings/Item';
import values from 'utils/data/slider_values.json';
import { backgroundImageEffects } from '../optionTypes';

const EffectsSettings = ({ backgroundFilter, onFilterChange }) => {
  return (
    <Row final={true}>
      <Content
        title={variables.getMessage('modals.main.settings.sections.background.effects.title')}
        subtitle={variables.getMessage(
          'modals.main.settings.sections.background.effects.subtitle',
        )}
      />
      <Action>
        <Slider
          title={variables.getMessage('modals.main.settings.sections.background.effects.blur')}
          name="blur"
          min="0"
          max="100"
          default="0"
          display="%"
          marks={values.background}
          category="backgroundeffect"
          element="#backgroundImage"
        />
        <Slider
          title={variables.getMessage(
            'modals.main.settings.sections.background.effects.brightness',
          )}
          name="brightness"
          min="0"
          max="100"
          default="90"
          display="%"
          marks={values.background}
          category="backgroundeffect"
          element="#backgroundImage"
        />
        <Dropdown
          label={variables.getMessage(
            'modals.main.settings.sections.background.effects.filters.title',
          )}
          name="backgroundFilter"
          onChange={onFilterChange}
          category="backgroundeffect"
          element="#backgroundImage"
          items={backgroundImageEffects}
        />
        {backgroundFilter !== 'none' && (
          <Slider
            title={variables.getMessage(
              'modals.main.settings.sections.background.effects.filters.amount',
            )}
            name="backgroundFilterAmount"
            min="0"
            max="100"
            default="0"
            display="%"
            marks={values.background}
            category="backgroundeffect"
            element="#backgroundImage"
          />
        )}
      </Action>
    </Row>
  );
};

export default EffectsSettings;
