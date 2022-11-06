import { memo } from 'react';

import variables from 'modules/variables';

import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';
import Radio from '../Radio';
import Slider from '../Slider';
import Text from '../Text';
import SettingsItem from '../SettingsItem';

import { values } from 'modules/helpers/settings/modals';

function AppearanceSettings() {
  return (
    <>
      <span className="mainTitle">
        {variables.getMessage('modals.main.settings.sections.appearance.title')}
      </span>
      <div className="settingsRow">
        <div className="content">
          <span className="title">
            {variables.getMessage('modals.main.settings.sections.appearance.theme.title')}
          </span>
          <span className="subtitle">
            {' '}
            {variables.getMessage('modals.main.settings.sections.appearance.theme.description')}
          </span>
        </div>
        <div className="action">
          <Radio
            name="theme"
            options={[
              {
                name: variables.getMessage('modals.main.settings.sections.appearance.theme.auto'),
                value: 'auto',
              },
              {
                name: variables.getMessage('modals.main.settings.sections.appearance.theme.light'),
                value: 'light',
              },
              {
                name: variables.getMessage('modals.main.settings.sections.appearance.theme.dark'),
                value: 'dark',
              },
            ]}
            category="other"
          />
        </div>
      </div>
      <div className="settingsRow">
        <div className="content">
          <span className="title">
            {variables.getMessage('modals.main.settings.sections.appearance.font.title')}
          </span>
          <span className="subtitle">
            {variables.getMessage('modals.main.settings.sections.appearance.font.description')}
          </span>
        </div>
        <div className="action">
          <Checkbox
            name="fontGoogle"
            text={variables.getMessage('modals.main.settings.sections.appearance.font.google')}
            category="other"
          />
          <Text
            title={variables.getMessage('modals.main.settings.sections.appearance.font.custom')}
            name="font"
            upperCaseFirst={true}
            category="other"
          />
          <Dropdown
            label={variables.getMessage(
              'modals.main.settings.sections.appearance.font.weight.title',
            )}
            name="fontweight"
            category="other"
          >
            {/* names are taken from https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight */}
            <option value="100">
              {variables.getMessage('modals.main.settings.sections.appearance.font.weight.thin')}
            </option>
            <option value="200">
              {variables.getMessage(
                'modals.main.settings.sections.appearance.font.weight.extra_light',
              )}
            </option>
            <option value="300">
              {variables.getMessage('modals.main.settings.sections.appearance.font.weight.light')}
            </option>
            <option value="400">
              {variables.getMessage('modals.main.settings.sections.appearance.font.weight.normal')}
            </option>
            <option value="500">
              {variables.getMessage('modals.main.settings.sections.appearance.font.weight.medium')}
            </option>
            <option value="600">
              {variables.getMessage(
                'modals.main.settings.sections.appearance.font.weight.semi_bold',
              )}
            </option>
            <option value="700">
              {variables.getMessage('modals.main.settings.sections.appearance.font.weight.bold')}
            </option>
            <option value="800">
              {variables.getMessage(
                'modals.main.settings.sections.appearance.font.weight.extra_bold',
              )}
            </option>
          </Dropdown>
          <Dropdown
            label={variables.getMessage(
              'modals.main.settings.sections.appearance.font.style.title',
            )}
            name="fontstyle"
            category="other"
          >
            <option value="normal">
              {variables.getMessage('modals.main.settings.sections.appearance.font.style.normal')}
            </option>
            <option value="italic">
              {variables.getMessage('modals.main.settings.sections.appearance.font.style.italic')}
            </option>
            <option value="oblique">
              {variables.getMessage('modals.main.settings.sections.appearance.font.style.oblique')}
            </option>
          </Dropdown>
        </div>
      </div>
      <SettingsItem
        title={variables.getMessage('modals.main.settings.sections.appearance.style.title')}
        subtitle={variables.getMessage(
          'modals.main.settings.sections.appearance.style.description',
        )}
      >
        <Radio
          name="widgetStyle"
          element=".other"
          options={[
            {
              name: variables.getMessage('modals.main.settings.sections.appearance.style.legacy'),
              value: 'legacy',
            },
            {
              name: variables.getMessage('modals.main.settings.sections.appearance.style.new'),
              value: 'new',
            },
          ]}
          category="widgets"
        />
      </SettingsItem>

      <SettingsItem
        title={variables.getMessage('modals.main.settings.sections.appearance.accessibility.title')}
        subtitle={variables.getMessage(
          'modals.main.settings.sections.appearance.accessibility.description',
        )}
        final={true}
      >
        <Dropdown
          label={variables.getMessage(
            'modals.main.settings.sections.appearance.accessibility.text_shadow.title',
          )}
          name="textBorder"
          category="other"
        >
          <option value="new">
            {variables.getMessage(
              'modals.main.settings.sections.appearance.accessibility.text_shadow.new',
            )}
          </option>{' '}
          {/* default */}
          <option value="true">
            {variables.getMessage(
              'modals.main.settings.sections.appearance.accessibility.text_shadow.old',
            )}
          </option>{' '}
          {/* old checkbox setting */}
          <option value="none">
            {variables.getMessage(
              'modals.main.settings.sections.appearance.accessibility.text_shadow.none',
            )}
          </option>
        </Dropdown>
        <Checkbox
          text={variables.getMessage(
            'modals.main.settings.sections.appearance.accessibility.animations',
          )}
          name="animations"
          category="other"
        />
        <Slider
          title={variables.getMessage(
            'modals.main.settings.sections.appearance.accessibility.toast_duration',
          )}
          name="toastDisplayTime"
          default="2500"
          step="100"
          min="500"
          max="5000"
          marks={values('toast')}
          display={
            ' ' +
            variables.getMessage(
              'modals.main.settings.sections.appearance.accessibility.milliseconds',
            )
          }
        />
      </SettingsItem>
    </>
  );
}

export default memo(AppearanceSettings);
