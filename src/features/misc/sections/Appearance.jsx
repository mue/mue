import { memo, useState } from 'react';

import variables from 'config/variables';

import { Checkbox, Dropdown, Radio, Slider, Text } from 'components/Form/Settings';
import { Header, Section, Row, Content, Action } from 'components/Layout/Settings';

import { MdAccessibility } from 'react-icons/md';

import values from 'utils/data/slider_values.json';

function AppearanceOptions() {
  const [accessibility, setAccessibility] = useState(false);

  const ThemeSelection = () => {
    return (
      <Row>
        <Content
          title={variables.getMessage('modals.main.settings.sections.appearance.theme.title')}
          subtitle={variables.getMessage(
            'modals.main.settings.sections.appearance.theme.description',
          )}
        />
        <Action>
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
        </Action>
      </Row>
    );
  };

  const FontOptions = () => {
    const fontWeight = 'modals.main.settings.sections.appearance.font.weight';
    return (
      <Row>
        <Content
          title={variables.getMessage('modals.main.settings.sections.appearance.font.title')}
          subtitle={variables.getMessage(
            'modals.main.settings.sections.appearance.font.description',
          )}
        />
        <Action>
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
          {/* names are taken from https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight */}
          <Dropdown
            label={variables.getMessage(
              'modals.main.settings.sections.appearance.font.weight.title',
            )}
            name="fontweight"
            category="other"
            items={[
              {
                value: '100',
                text: variables.getMessage(fontWeight + '.thin'),
              },
              {
                value: '200',
                text: variables.getMessage(fontWeight + '.extra_light'),
              },
              {
                value: '300',
                text: variables.getMessage(fontWeight + '.light'),
              },
              {
                value: '400',
                text: variables.getMessage(fontWeight + '.normal'),
              },
              {
                value: '500',
                text: variables.getMessage(fontWeight + '.medium'),
              },
              {
                value: '600',
                text: variables.getMessage(fontWeight + '.semi_bold'),
              },
              {
                value: '700',
                text: variables.getMessage(fontWeight + '.bold'),
              },
              {
                value: '800',
                text: variables.getMessage(fontWeight + '.extra_bold'),
              },
            ]}
          />
          <Dropdown
            label={variables.getMessage(
              'modals.main.settings.sections.appearance.font.style.title',
            )}
            name="fontstyle"
            category="other"
            items={[
              {
                value: 'normal',
                text: variables.getMessage(
                  'modals.main.settings.sections.appearance.font.style.normal',
                ),
              },
              {
                value: 'italic',
                text: variables.getMessage(
                  'modals.main.settings.sections.appearance.font.style.italic',
                ),
              },
              {
                value: 'oblique',
                text: variables.getMessage(
                  'modals.main.settings.sections.appearance.font.style.oblique',
                ),
              },
            ]}
          />
        </Action>
      </Row>
    );
  };

  const WidgetStyle = () => {
    return (
      <Row>
        <Content
          title={variables.getMessage('modals.main.settings.sections.appearance.style.title')}
          subtitle={variables.getMessage(
            'modals.main.settings.sections.appearance.style.description',
          )}
        />
        <Action>
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
        </Action>
      </Row>
    );
  };

  const AccessibilityOptions = () => {
    return (
      <Row final={true}>
        <Content
          title={variables.getMessage(
            'modals.main.settings.sections.appearance.accessibility.title',
          )}
          subtitle={variables.getMessage(
            'modals.main.settings.sections.appearance.accessibility.description',
          )}
        />
        <Action>
          <Dropdown
            label={variables.getMessage(
              'modals.main.settings.sections.appearance.accessibility.text_shadow.title',
            )}
            name="textBorder"
            category="other"
            items={[
              {
                value: 'new',
                text: variables.getMessage(
                  'modals.main.settings.sections.appearance.accessibility.text_shadow.new',
                ),
              },
              {
                value: 'true',
                text: variables.getMessage(
                  'modals.main.settings.sections.appearance.accessibility.text_shadow.old',
                ),
              },
              {
                value: 'none',
                text: variables.getMessage(
                  'modals.main.settings.sections.appearance.accessibility.text_shadow.none',
                ),
              },
            ]}
          />
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
            marks={values.toast}
            display={
              ' ' +
              variables.getMessage(
                'modals.main.settings.sections.appearance.accessibility.milliseconds',
              )
            }
          />
        </Action>
      </Row>
    );
  };

  let header;
  if (accessibility) {
    header = (
      <Header
        title={variables.getMessage('modals.main.settings.sections.appearance.title')}
        secondaryTitle={variables.getMessage(
          'modals.main.settings.sections.appearance.accessibility.title',
        )}
        goBack={() => setAccessibility(false)}
        report={false}
      />
    );
  } else {
    header = (
      <Header
        title={variables.getMessage('modals.main.settings.sections.appearance.title')}
        report={false}
      />
    );
  }
  return (
    <>
      {header}
      {accessibility ? (
        <AccessibilityOptions />
      ) : (
        <>
          <Section
            title={variables.getMessage(
              'modals.main.settings.sections.appearance.accessibility.title',
            )}
            subtitle={variables.getMessage(
              'modals.main.settings.sections.appearance.accessibility.description',
            )}
            icon={<MdAccessibility />}
            onClick={() => setAccessibility(true)}
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
