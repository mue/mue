import { useT } from 'contexts';
import { useState } from 'react';

import { Header } from 'components/Layout/Settings';
import { Checkbox, Dropdown } from 'components/Form/Settings';

import { Row, Content, Action, PreferencesWrapper } from 'components/Layout/Settings';

function DateOptions() {
  const t = useT();
  const [dateType, setDateType] = useState(localStorage.getItem('dateType') || 'long');
  const dateFormats = ['DMY', 'MDY', 'YMD'];

  const longSettings = (
    <>
      <Dropdown
        label={t('modals.main.settings.sections.date.long_format')}
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
        text={t('modals.main.settings.sections.date.day_of_week')}
        category="date"
      />
      <Checkbox
        name="datenth"
        text={t('modals.main.settings.sections.date.datenth')}
        category="date"
      />
    </>
  );

  const shortSettings = (
    <>
      <Dropdown
        label={t('modals.main.settings.sections.date.short_format')}
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
        label={t('modals.main.settings.sections.date.short_separator.title')}
        name="shortFormat"
        category="date"
        items={[
          {
            value: 'dash',
            text: t('modals.main.settings.sections.date.short_separator.dash'),
          },
          {
            value: 'dots',
            text: t('modals.main.settings.sections.date.short_separator.dots'),
          },
          {
            value: 'gaps',
            text: t('modals.main.settings.sections.date.short_separator.gaps'),
          },
          {
            value: 'slashes',
            text: t('modals.main.settings.sections.date.short_separator.slashes'),
          },
        ]}
      />
    </>
  );

  return (
    <>
      <Header
        title={t('modals.main.settings.sections.date.title')}
        setting="date"
        category="date"
        element=".date"
        zoomSetting="zoomDate"
        visibilityToggle={true}
      />
      <PreferencesWrapper
        setting="date"
        visibilityToggle={true}
        category="date"
        zoomSetting="zoomDate"
      >
        <Row>
          <Content
            title={t('modals.main.settings.sections.time.type')}
            subtitle={t('modals.main.settings.sections.date.type.subtitle')}
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
                  text: t('modals.main.settings.sections.date.type.long'),
                },
                {
                  value: 'short',
                  text: t('modals.main.settings.sections.date.type.short'),
                },
              ]}
            />
          </Action>
        </Row>
        <Row final={true}>
          <Content
            title={
              dateType === 'long'
                ? t('modals.main.settings.sections.date.type.long')
                : t('modals.main.settings.sections.date.type.short')
            }
            subtitle={t('modals.main.settings.sections.date.type_settings')}
          />
          <Action>
            {dateType === 'long' ? longSettings : shortSettings}
            <Checkbox
              name="weeknumber"
              text={t('modals.main.settings.sections.date.week_number')}
              category="date"
            />
            <Checkbox
              name="datezero"
              text={t('modals.main.settings.sections.time.digital.zero')}
              category="date"
            />
          </Action>
        </Row>
      </PreferencesWrapper>
    </>
  );
}

export { DateOptions as default, DateOptions };
