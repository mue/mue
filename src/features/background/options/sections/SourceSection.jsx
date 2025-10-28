import variables from 'config/variables';
import { Dropdown } from 'components/Form/Settings';
import { Row, Content, Action } from 'components/Layout/Settings/Item';
import { getBackgroundOptionItems } from '../optionTypes';

const SourceSection = ({ backgroundType, marketplaceEnabled, onTypeChange }) => {
  return (
    <Row
      final={backgroundType === 'random_colour' || backgroundType === 'random_gradient'}
    >
      <Content
        title={variables.getMessage('modals.main.settings.sections.background.source.title')}
        subtitle={variables.getMessage(
          'modals.main.settings.sections.background.source.subtitle',
        )}
      />
      <Action>
        <Dropdown
          label={variables.getMessage('modals.main.settings.sections.background.type.title')}
          name="backgroundType"
          onChange={onTypeChange}
          category="background"
          items={getBackgroundOptionItems(marketplaceEnabled)}
        />
      </Action>
    </Row>
  );
};

export default SourceSection;
