import variables from 'config/variables';
import { useState } from 'react';

import Header from '../../../../../components/Layout/Settings/Header/Header';
import Checkbox from '../../../../../components/Form/Settings/Checkbox/Checkbox';
import Dropdown from '../../../../../components/Form/Settings/Dropdown/Dropdown';

import { Row, Content, Action } from '../../../../../components/Layout/Settings/Item/SettingsItem';
import PreferencesWrapper from '../PreferencesWrapper';

export default function Date() {
  const [dateType, setDateType] = useState(localStorage.getItem('dateType') || 'long');
  const dateFormats = ['DMY', 'MDY', 'YMD'];

  const longSettings = (
    <>
      <Dropdown
        label={variables.getMessage('modals.main.settings.sections.date.long_format')}
        name="longFormat"
        category="date"
        items={dateFormats.map((format) => {
          return {
            value: format,
            text: format,
          };
        })}
      />
      <Checkbox
        name="dayofweek"
        text={variables.getMessage('modals.main.settings.sections.date.day_of_week')}
        category="date"
      />
      <Checkbox
        name="datenth"
        text={variables.getMessage('modals.main.settings.sections.date.datenth')}
        category="date"
      />
    </>
  );

  const shortSettings = (
    <>
      <Dropdown
        label={variables.getMessage('modals.main.settings.sections.date.short_format')}
        name="dateFormat"
        category="date"
        items={dateFormats.map((format) => {
          return {
            value: format,
            text: format,
          };
        })}
      />

      <Dropdown
        label={variables.getMessage('modals.main.settings.sections.date.short_separator.title')}
        name="shortFormat"
        category="date"
        items={[
          {
            value: 'dash',
            text: variables.getMessage('modals.main.settings.sections.date.short_separator.dash'),
          },
          {
            value: 'dots',
            text: variables.getMessage('modals.main.settings.sections.date.short_separator.dots'),
          },
          {
            value: 'gaps',
            text: variables.getMessage('modals.main.settings.sections.date.short_separator.gaps'),
          },
          {
            value: 'slashes',
            text: variables.getMessage(
              'modals.main.settings.sections.date.short_separator.slashes',
            ),
          },
        ]}
      />
    </>
  );

  return (
    <>
      <Header
        title={variables.getMessage('modals.main.settings.sections.date.title')}
        setting="date"
        category="date"
        element=".date"
        zoomSetting="zoomDate"
        visibilityToggle={true}
      />
      <PreferencesWrapper setting="date" visibilityToggle={true} zoomSetting="zoomDate">
        <Row>
          <Content
            title={variables.getMessage('modals.main.settings.sections.time.type')}
            subtitle={variables.getMessage('modals.main.settings.sections.date.type.subtitle')}
          />
          <Action>
            <Dropdown
              name="dateType"
              onChange={(value) => {
                setDateType(value);
                localStorage.setItem('dateType', value);
              }}
              category="date"
              items={[
                {
                  value: 'long',
                  text: variables.getMessage('modals.main.settings.sections.date.type.long'),
                },
                {
                  value: 'short',
                  text: variables.getMessage('modals.main.settings.sections.date.type.short'),
                },
              ]}
            />
          </Action>
        </Row>
        <Row final={true}>
          <Content
            title={
              dateType === 'long'
                ? variables.getMessage('modals.main.settings.sections.date.type.long')
                : variables.getMessage('modals.main.settings.sections.date.type.short')
            }
            subtitle={variables.getMessage('modals.main.settings.sections.date.type_settings')}
          />
          <Action>
            {dateType === 'long' ? longSettings : shortSettings}
            <Checkbox
              name="weeknumber"
              text={variables.getMessage('modals.main.settings.sections.date.week_number')}
              category="date"
            />
            <Checkbox
              name="datezero"
              text={variables.getMessage('modals.main.settings.sections.time.digital.zero')}
              category="date"
            />
          </Action>
        </Row>
      </PreferencesWrapper>
    </>
  );
}
