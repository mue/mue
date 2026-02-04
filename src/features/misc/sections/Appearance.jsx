import { memo, useState } from 'react';

import { useT } from 'contexts';
import googleFonts from 'config/googleFonts.json';

import { Checkbox, Dropdown, Radio, Slider, Text } from 'components/Form/Settings';
import { Header, Section, Row, Content, Action } from 'components/Layout/Settings';

import { MdAccessibility } from 'react-icons/md';

import values from 'utils/data/slider_values.json';

function AppearanceOptions({ currentSubSection, onSubSectionChange, sectionName }) {
  const t = useT();
  const ThemeSelection = () => {
    return (
      <Row>
        <Content
          title={t('modals.main.settings.sections.appearance.theme.title')}
          subtitle={t('modals.main.settings.sections.appearance.theme.description')}
        />
        <Action>
          <Radio
            name="theme"
            options={[
              {
                name: t('modals.main.settings.sections.appearance.theme.auto'),
                value: 'auto',
              },
              {
                name: t('modals.main.settings.sections.appearance.theme.light'),
                value: 'light',
              },
              {
                name: t('modals.main.settings.sections.appearance.theme.dark'),
                value: 'dark',
              },
            ]}
            category="other"
          />
        </Action>
      </Row>
    );
  };

  const FontOptions = () => {
    const fontWeight = 'modals.main.settings.sections.appearance.font.weight';
    return (
      <Row>
        <Content
          title={t('modals.main.settings.sections.appearance.font.title')}
          subtitle={t('modals.main.settings.sections.appearance.font.description')}
        />
        <Action>
          <Dropdown
            label={t('modals.main.settings.sections.appearance.font.custom')}
            name="font"
            category="other"
            searchable={true}
            items={googleFonts.map((font) => ({
              value: font,
              text: font,
            }))}
          />
          {/* names are taken from https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight */}
          <Dropdown
            label={t('modals.main.settings.sections.appearance.font.weight.title')}
            name="fontweight"
            category="other"
            items={[
              {
                value: '400',
                text: t(fontWeight + '.normal'),
              },
              {
                value: '100',
                text: t(fontWeight + '.thin'),
              },
              {
                value: '200',
                text: t(fontWeight + '.extra_light'),
              },
              {
                value: '300',
                text: t(fontWeight + '.light'),
              },
              {
                value: '500',
                text: t(fontWeight + '.medium'),
              },
              {
                value: '600',
                text: t(fontWeight + '.semi_bold'),
              },
              {
                value: '700',
                text: t(fontWeight + '.bold'),
              },
              {
                value: '800',
                text: t(fontWeight + '.extra_bold'),
              },
            ]}
          />
          <Dropdown
            label={t('modals.main.settings.sections.appearance.font.style.title')}
            name="fontstyle"
            category="other"
            items={[
              {
                value: 'normal',
                text: t('modals.main.settings.sections.appearance.font.style.normal'),
              },
              {
                value: 'italic',
                text: t('modals.main.settings.sections.appearance.font.style.italic'),
              },
              {
                value: 'oblique',
                text: t('modals.main.settings.sections.appearance.font.style.oblique'),
              },
            ]}
          />
        </Action>
      </Row>
    );
  };

  const WidgetStyle = () => {
    return (
      <Row final={true}>
        <Content
          title={t('modals.main.settings.sections.appearance.style.title')}
          subtitle={t('modals.main.settings.sections.appearance.style.description')}
        />
        <Action>
          <Radio
            name="widgetStyle"
            element=".other"
            options={[
              {
                name: t('modals.main.settings.sections.appearance.style.legacy'),
                value: 'legacy',
              },
              {
                name: t('modals.main.settings.sections.appearance.style.new'),
                value: 'new',
              },
            ]}
            category="widgets"
          />
        </Action>
      </Row>
    );
  };

  const AccessibilityOptions = () => {
    return (
      <Row final={true}>
        <Content
          title={t('modals.main.settings.sections.appearance.accessibility.title')}
          subtitle={t('modals.main.settings.sections.appearance.accessibility.description')}
        />
        <Action>
          <Dropdown
            label={t('modals.main.settings.sections.appearance.accessibility.text_shadow.title')}
            name="textBorder"
            category="other"
            items={[
              {
                value: 'new',
                text: t('modals.main.settings.sections.appearance.accessibility.text_shadow.new'),
              },
              {
                value: 'true',
                text: t('modals.main.settings.sections.appearance.accessibility.text_shadow.old'),
              },
              {
                value: 'none',
                text: t('modals.main.settings.sections.appearance.accessibility.text_shadow.none'),
              },
            ]}
          />
          <Checkbox
            text={t('modals.main.settings.sections.appearance.accessibility.animations')}
            name="animations"
            category="other"
          />
          <Slider
            title={t('modals.main.settings.sections.appearance.accessibility.toast_duration')}
            name="toastDisplayTime"
            default="2500"
            step="100"
            min="500"
            max="5000"
            marks={values.toast}
            display={' ' + t('modals.main.settings.sections.appearance.accessibility.milliseconds')}
          />
        </Action>
      </Row>
    );
  };

  const isAccessibilitySection = currentSubSection === 'accessibility';

  let header;
  if (isAccessibilitySection) {
    header = (
      <Header
        title={t('modals.main.settings.sections.appearance.title')}
        secondaryTitle={t('modals.main.settings.sections.appearance.accessibility.title')}
        goBack={() => onSubSectionChange(null, sectionName)}
        report={false}
      />
    );
  } else {
    header = <Header title={t('modals.main.settings.sections.appearance.title')} report={false} />;
  }
  return (
    <>
      {header}
      {isAccessibilitySection ? (
        <AccessibilityOptions />
      ) : (
        <>
          <Section
            title={t('modals.main.settings.sections.appearance.accessibility.title')}
            subtitle={t('modals.main.settings.sections.appearance.accessibility.description')}
            icon={<MdAccessibility />}
            onClick={() => onSubSectionChange('accessibility', sectionName)}
          />
          <ThemeSelection />
          <FontOptions />
          <WidgetStyle />
        </>
      )}
    </>
  );
}

const MemoizedAppearanceOptions = memo(AppearanceOptions);
export { MemoizedAppearanceOptions as default, MemoizedAppearanceOptions as AppearanceOptions };
