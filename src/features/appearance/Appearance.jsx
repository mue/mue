import { memo, useState } from 'react';

import variables from 'config/variables';
import EventBus from 'utils/eventbus';

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

import { AccessibilityOptions, FontOptions } from './sections/';

import { MdAccessibility, MdFormatSize } from 'react-icons/md';

import values from 'utils/data/slider_values.json';

function AppearanceOptions() {
  const [accessibility, setAccessibility] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('theme') || 'auto');
  const { subSection } = useTab();

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

  const ThemeSelector = (currentTheme) => {
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

    const ThemeCard = ({ example, name, value }) => {
      const handleClick = () => {
        localStorage.setItem('theme', value);
        setCurrentTheme(value);
        EventBus.emit('refresh', 'other');
      };

      return (
        <div
          className={
            'flex flex-col items-center rounded p-2 hover:bg-background-light hover:dark:bg-background-dark cursor-pointer' +
            (currentTheme === value ? ' border-2 border-neutral-100' : '')
          }
          onClick={handleClick}
        >
          <img src={`theme-examples/${example}`} alt="Light theme" className="rounded-t" />
          <div className="py-4">{name}</div>
        </div>
      );
    };

    return (
      <div className="bg-modal-content-light dark:bg-modal-content-dark p-10 rounded divide-gray-500 flex flex-col gap-5">
        <h1 className="text-3xl tracking-tight font-semibold">
          {variables.getMessage('settings:sections.appearance.theme.title')}
        </h1>
        <p className="text-neutral-800 dark:text-neutral-300">
          {variables.getMessage('settings:sections.appearance.theme.description')}
        </p>
        <div className="grid grid-cols-3 items-center gap-28">
          {themes.map((theme) => (
            <ThemeCard key={theme.value} {...theme} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {subSection === 'font' && <FontOptions />}
      {subSection === 'accessibility' && <AccessibilityOptions />}
      {subSection === '' && (
        <>
          <Section
            id="accessibility"
            title={variables.getMessage('settings:sections.appearance.accessibility.title')}
            subtitle={variables.getMessage(
              'settings:sections.appearance.accessibility.description',
            )}
            icon={<MdAccessibility />}
          />
          <Section
            id="font"
            title={variables.getMessage('settings:sections.appearance.font.title')}
            subtitle={variables.getMessage('settings:sections.appearance.font.description')}
            icon={<MdFormatSize />}
          />
          {ThemeSelector(currentTheme)}
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
