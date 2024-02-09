import variables from 'modules/variables';
import { useState } from 'react';

import Header from '../Header';
import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';

import { Row, Content, Action } from '../SettingsItem';
import PreferencesWrapper from '../PreferencesWrapper';

export default function Date() {
  const [dateType, setDateType] = useState(localStorage.getItem('dateType') || 'long');
  const longSettings = (
    <>
      <Dropdown
        label={variables.getMessage('modals.main.settings.sections.date.long_format')}
        name="longFormat"
        category="date"
      >
        <option value="DMY">DMY</option>
        <option value="MDY">MDY</option>
        <option value="YMD">YMD</option>
      </Dropdown>
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
      >
        <option value="DMY">DMY</option>
        <option value="MDY">MDY</option>
        <option value="YMD">YMD</option>
      </Dropdown>

      <Dropdown
        label={variables.getMessage('modals.main.settings.sections.date.short_separator.title')}
        name="shortFormat"
        category="date"
      >
        <option value="dash">
          {variables.getMessage('modals.main.settings.sections.date.short_separator.dash')}
        </option>
        <option value="dots">
          {variables.getMessage('modals.main.settings.sections.date.short_separator.dots')}
        </option>
        <option value="gaps">
          {variables.getMessage('modals.main.settings.sections.date.short_separator.gaps')}
        </option>
        <option value="slashes">
          {variables.getMessage('modals.main.settings.sections.date.short_separator.slashes')}
        </option>
      </Dropdown>
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
        switch={true}
      />
      <PreferencesWrapper setting="date" switch={true} zoomSetting="zoomDate">
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
            >
              <option value="long">
                {variables.getMessage('modals.main.settings.sections.date.type.long')}
              </option>
              <option value="short">
                {variables.getMessage('modals.main.settings.sections.date.type.short')}
              </option>
            </Dropdown>
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
