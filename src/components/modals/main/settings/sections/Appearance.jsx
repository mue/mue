import variables from 'modules/variables';

import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';
import Radio from '../Radio';
import Slider from '../Slider';
import Text from '../Text';
import SettingsItem from '../SettingsItem';

import { values } from 'modules/helpers/settings/modals';

export default function AppearanceSettings() {
  const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

  const themeOptions = [
    {
      name: getMessage('modals.main.settings.sections.appearance.theme.auto'),
      value: 'auto',
    },
    {
      name: getMessage('modals.main.settings.sections.appearance.theme.light'),
      value: 'light',
    },
    {
      name: getMessage('modals.main.settings.sections.appearance.theme.dark'),
      value: 'dark',
    },
  ];

  const styleOptions = [
    {
      name: 'Legacy',
      value: 'legacy',
    },
    {
      name: 'New',
      value: 'new',
    },
  ];

  return (
    <>
      <span className="mainTitle">
        {getMessage('modals.main.settings.sections.appearance.title')}
      </span>
      <div className="settingsRow">
        <div className="content">
          <span className="title">
            {getMessage('modals.main.settings.sections.appearance.theme.title')}
          </span>
          <span className="subtitle">subtitle</span>
        </div>
        <div className="action">
          <Radio name="theme" options={themeOptions} category="other" />
        </div>
      </div>
      <div className="settingsRow">
        <div className="content">
          <span className="title">
            {getMessage('modals.main.settings.sections.appearance.font.title')}
          </span>
          <span className="subtitle">subtitle</span>
        </div>
        <div className="action">
          <Checkbox
            name="fontGoogle"
            text={getMessage('modals.main.settings.sections.appearance.font.google')}
            category="other"
          />
          <Text
            title={getMessage('modals.main.settings.sections.appearance.font.custom')}
            name="font"
            upperCaseFirst={true}
            category="other"
          />
          <Dropdown
            label={getMessage('modals.main.settings.sections.appearance.font.weight.title')}
            name="fontweight"
            category="other"
          >
            {/* names are taken from https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight */}
            <option value="100">
              {getMessage('modals.main.settings.sections.appearance.font.weight.thin')}
            </option>
            <option value="200">
              {getMessage('modals.main.settings.sections.appearance.font.weight.extra_light')}
            </option>
            <option value="300">
              {getMessage('modals.main.settings.sections.appearance.font.weight.light')}
            </option>
            <option value="400">
              {getMessage('modals.main.settings.sections.appearance.font.weight.normal')}
            </option>
            <option value="500">
              {getMessage('modals.main.settings.sections.appearance.font.weight.medium')}
            </option>
            <option value="600">
              {getMessage('modals.main.settings.sections.appearance.font.weight.semi_bold')}
            </option>
            <option value="700">
              {getMessage('modals.main.settings.sections.appearance.font.weight.bold')}
            </option>
            <option value="800">
              {getMessage('modals.main.settings.sections.appearance.font.weight.extra_bold')}
            </option>
          </Dropdown>
          <Dropdown
            label={getMessage('modals.main.settings.sections.appearance.font.style.title')}
            name="fontstyle"
            category="other"
          >
            <option value="normal">
              {getMessage('modals.main.settings.sections.appearance.font.style.normal')}
            </option>
            <option value="italic">
              {getMessage('modals.main.settings.sections.appearance.font.style.italic')}
            </option>
            <option value="oblique">
              {getMessage('modals.main.settings.sections.appearance.font.style.oblique')}
            </option>
          </Dropdown>
        </div>
      </div>
      <SettingsItem
        title="Widget Style"
        subtitle="Choose between the two styles, legacy (enabled for pre 7.0 users) and our slick modern styling."
      >
        <Radio name="widgetStyle" options={styleOptions} category="widgets" />
      </SettingsItem>

      {/*<h3>{getMessage('modals.main.settings.sections.appearance.accessibility.title')}</h3>
      <Checkbox text={getMessage('modals.main.settings.sections.appearance.accessibility.text_shadow')} name='textBorder' category='other'/>
      <Checkbox text={getMessage('modals.main.settings.sections.appearance.accessibility.animations')} name='animations' category='other'/>
      <Slider title={getMessage('modals.main.settings.sections.appearance.accessibility.toast_duration')} name='toastDisplayTime' default='2500' step='100' min='500' max='5000' marks={values('toast')}
  display={' ' + getMessage('modals.main.settings.sections.appearance.accessibility.milliseconds')} />*/}
      <div className="settingsRow">
        <div className="content">
          <span className="title">
            {getMessage('modals.main.settings.sections.appearance.accessibility.title')}
          </span>
          <span className="subtitle">subtitle</span>
        </div>
        <div className="action">
          <Dropdown
            label={getMessage('modals.main.settings.sections.appearance.accessibility.text_shadow')}
            name="textBorder"
            category="other"
          >
            <option value="new">New</option> {/* default */}
            <option value="true">Old</option> {/* old checkbox setting */}
            <option value="none">None</option>
          </Dropdown>
          <Checkbox
            text={getMessage('modals.main.settings.sections.appearance.accessibility.animations')}
            name="animations"
            category="other"
          />
          <Slider
            title={getMessage(
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
              getMessage('modals.main.settings.sections.appearance.accessibility.milliseconds')
            }
          />
        </div>
      </div>
    </>
  );
}
