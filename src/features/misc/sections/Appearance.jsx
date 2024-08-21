import { memo, useState } from 'react';

import variables from 'config/variables';

import { Checkbox, Dropdown, Radio, Slider, Text } from 'components/Form/Settings';
import {
  Header,
  Section,
  Row,
  Content,
  Action,
  PreferencesWrapper,
} from 'components/Layout/Settings';
import { useTab } from 'components/Elements/MainModal/backend/TabContext';

import { MdAccessibility } from 'react-icons/md';

import values from 'utils/data/slider_values.json';

function AppearanceOptions() {
  const [accessibility, setAccessibility] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('theme') || 'auto');
  const { subSection } = useTab();

  const ThemeSelection = () => {
    return (
      <Row>
        <Content
          title={variables.getMessage('settings:sections.appearance.theme.title')}
          subtitle={variables.getMessage('settings:sections.appearance.theme.description')}
        />
        <Action>
          <Radio
            name="theme"
            options={[
              {
                name: variables.getMessage('settings:sections.appearance.theme.auto'),
                value: 'auto',
              },
              {
                name: variables.getMessage('settings:sections.appearance.theme.light'),
                value: 'light',
              },
              {
                name: variables.getMessage('settings:sections.appearance.theme.dark'),
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
    const fontWeight = 'settings:sections.appearance.font.weight';
    return (
      <Row>
        <Content
          title={variables.getMessage('settings:sections.appearance.font.title')}
          subtitle={variables.getMessage('settings:sections.appearance.font.description')}
        />
        <Action>
          <Checkbox
            name="fontGoogle"
            text={variables.getMessage('settings:sections.appearance.font.google')}
            category="other"
          />
          <Text
            title={variables.getMessage('settings:sections.appearance.font.custom')}
            name="font"
            upperCaseFirst={true}
            category="other"
          />
          {/* names are taken from https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight */}
          <Dropdown
            label={variables.getMessage('settings:sections.appearance.font.weight.title')}
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
            label={variables.getMessage('settings:sections.appearance.font.style.title')}
            name="fontstyle"
            category="other"
            items={[
              {
                value: 'normal',
                text: variables.getMessage('settings:sections.appearance.font.style.normal'),
              },
              {
                value: 'italic',
                text: variables.getMessage('settings:sections.appearance.font.style.italic'),
              },
              {
                value: 'oblique',
                text: variables.getMessage('settings:sections.appearance.font.style.oblique'),
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
          title={variables.getMessage('settings:sections.appearance.style.title')}
          subtitle={variables.getMessage('settings:sections.appearance.style.description')}
        />
        <Action>
          <Radio
            name="widgetStyle"
            element=".other"
            options={[
              {
                name: variables.getMessage('settings:sections.appearance.style.legacy'),
                value: 'legacy',
              },
              {
                name: variables.getMessage('settings:sections.appearance.style.new'),
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
          title={variables.getMessage('settings:sections.appearance.accessibility.title')}
          subtitle={variables.getMessage('settings:sections.appearance.accessibility.description')}
        />
        <Action>
          <Dropdown
            label={variables.getMessage(
              'settings:sections.appearance.accessibility.text_shadow.title',
            )}
            name="textBorder"
            category="other"
            items={[
              {
                value: 'new',
                text: variables.getMessage(
                  'settings:sections.appearance.accessibility.text_shadow.new',
                ),
              },
              {
                value: 'true',
                text: variables.getMessage(
                  'settings:sections.appearance.accessibility.text_shadow.old',
                ),
              },
              {
                value: 'none',
                text: variables.getMessage(
                  'settings:sections.appearance.accessibility.text_shadow.none',
                ),
              },
            ]}
          />
          <Checkbox
            text={variables.getMessage('settings:sections.appearance.accessibility.animations')}
            name="animations"
            category="other"
          />
          <Slider
            title={variables.getMessage(
              'settings:sections.appearance.accessibility.toast_duration',
            )}
            name="toastDisplayTime"
            default="2500"
            step="100"
            min="500"
            max="5000"
            marks={values.toast}
            display={
              ' ' + variables.getMessage('settings:sections.appearance.accessibility.milliseconds')
            }
          />
        </Action>
      </Row>
    );
  };

  const newThemeSelector = (currentTheme) => {
    const themes = [
      {
        example: 'light.jpg',
        name: variables.getMessage('settings:sections.appearance.theme.light'),
        value: 'light',
      },
      {
        example: 'dark.jpg',
        name: variables.getMessage('settings:sections.appearance.theme.dark'),
        value: 'dark',
      },
      {
        example: 'light.jpg',
        name: variables.getMessage('settings:sections.appearance.theme.auto'),
        value: 'auto',
      },
    ];

    console.log(currentTheme);

    const ThemeCard = ({ example, name, value }) => {
      return (
        <div
          class={
            'flex flex-col items-center rounded p-2 hover:bg-background-light hover:dark:bg-background-dark cursor-pointer' +
            (currentTheme === value ? ' border-2 border-neutral-100' : '')
          }
        >
          <img src={`theme-examples/${example}`} alt="Light theme" class="rounded-t" />
          <div class="py-4">{name}</div>
        </div>
      );
    };

    return (
      <div class="bg-modal-content-light dark:bg-modal-content-dark p-10 rounded divide-gray-500 flex flex-col gap-5">
        <h1 class="text-3xl tracking-tight font-semibold">
          {variables.getMessage('settings:sections.appearance.theme.title')}
        </h1>
        <p class="text-neutral-300">
          {variables.getMessage('settings:sections.appearance.theme.description')}
        </p>
        <div class="grid grid-cols-3 items-center gap-28">
          {themes.map((theme) => (
            <ThemeCard key={theme.value} {...theme} />
          ))}
        </div>
      </div>
    );
  };

  let header;
  if (accessibility) {
    header = (
      <Header
        title={variables.getMessage('settings:sections.appearance.title')}
        secondaryTitle={variables.getMessage('settings:sections.appearance.accessibility.title')}
        goBack={() => setAccessibility(false)}
        report={false}
      />
    );
  } else {
    header = (
      <Header title={variables.getMessage('settings:sections.appearance.title')} report={false} />
    );
  }
  return (
    <>
      {/*{header}*/}
      {subSection === 'accessibility' ? (
        <AccessibilityOptions />
      ) : (
        <>
          <Section
            id="accessibility"
            title={variables.getMessage('settings:sections.appearance.accessibility.title')}
            subtitle={variables.getMessage(
              'settings:sections.appearance.accessibility.description',
            )}
            icon={<MdAccessibility />}
            onClick={() => setAccessibility(true)}
          />
          {newThemeSelector(currentTheme)}
          <PreferencesWrapper>
            <ThemeSelection />
          </PreferencesWrapper>
          <PreferencesWrapper>
            <FontOptions />
          </PreferencesWrapper>
          <PreferencesWrapper>
            <WidgetStyle />
          </PreferencesWrapper>
        </>
      )}
    </>
  );
}

const MemoizedAppearanceOptions = memo(AppearanceOptions);
export { MemoizedAppearanceOptions as default, MemoizedAppearanceOptions as AppearanceOptions };
