import variables from 'config/variables';
import { Dropdown, Radio, Text, ChipSelect } from 'components/Form/Settings';
import { Row, Content, Action } from 'components/Layout/Settings/Item';
import { APIQualityOptions } from '../optionTypes';
import { clearQueuesOnSettingChange } from 'utils/queueOperations';

const APISettings = ({ backgroundAPI, backgroundCategories, onUpdateAPI }) => {
  return (
    <>
      <Row final={backgroundAPI === 'mue'}>
        <Content
          title={variables.getMessage('modals.main.settings.sections.background.api')}
          subtitle={variables.getMessage('modals.main.settings.sections.background.api_subtitle')}
        />
        <Action>
          {backgroundCategories[0] === variables.getMessage('modals.main.loading') ? (
            <>
              <Dropdown
                label={variables.getMessage('modals.main.settings.sections.background.category')}
                name="apiCategories"
                items={[
                  {
                    value: 'loading',
                    text: variables.getMessage('modals.main.loading'),
                  },
                  {
                    value: 'loading',
                    text: variables.getMessage('modals.main.loading'),
                  },
                ]}
              />
            </>
          ) : (
            <ChipSelect
              label={variables.getMessage('modals.main.settings.sections.background.categories')}
              options={backgroundCategories}
              name="apiCategories"
              onChange={() => {
                clearQueuesOnSettingChange('apiCategories');
              }}
            />
          )}
          <Dropdown
            label={variables.getMessage(
              'modals.main.settings.sections.background.source.quality.title',
            )}
            name="apiQuality"
            element=".other"
            items={APIQualityOptions}
            onChange={() => {
              clearQueuesOnSettingChange('apiQuality');
            }}
          />
          <Radio
            title={variables.getMessage('modals.main.settings.sections.background.source.api_title')}
            options={[
              {
                name: variables.getMessage('modals.main.settings.sections.background.source.api_mue'),
                value: 'mue',
              },
              {
                name: variables.getMessage('modals.main.settings.sections.background.source.api_unsplash'),
                value: 'unsplash',
              },
            ]}
            name="backgroundAPI"
            category="background"
            element="#backgroundImage"
            onChange={onUpdateAPI}
          />
        </Action>
      </Row>
      {backgroundAPI === 'unsplash' && (
        <Row final={true}>
          <Content
            title={variables.getMessage('modals.main.settings.sections.background.unsplash.title')}
            subtitle={variables.getMessage(
              'modals.main.settings.sections.background.unsplash.subtitle',
            )}
          />
          <Action>
            <Text
              title={variables.getMessage('modals.main.settings.sections.background.unsplash.id')}
              subtitle={variables.getMessage(
                'modals.main.settings.sections.background.unsplash.id_subtitle',
              )}
              placeholder={variables.getMessage('modals.main.settings.sections.background.source.collection_placeholder')}
              name="unsplashCollections"
              category="background"
              element="#backgroundImage"
              onChange={() => {
                clearQueuesOnSettingChange('unsplashCollections');
              }}
            />
          </Action>
        </Row>
      )}
    </>
  );
};

export default APISettings;
