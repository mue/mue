import variables from 'config/variables';
import { Checkbox } from 'components/Form/Settings';
import { Row, Content, Action } from 'components/Layout/Settings/Item';

const DisplaySettings = ({ usingImage }) => {
  return (
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
  );
};

export default DisplaySettings;
