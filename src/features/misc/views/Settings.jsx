import variables from 'config/variables';
import { memo } from 'react';

import Tabs from 'components/Elements/MainModal/backend/Tabs';

import { NavbarOptions } from 'features/navbar';
import { GreetingOptions } from 'features/greeting';
import { TimeOptions, DateOptions } from 'features/time';
import { QuickLinksOptions } from 'features/quicklinks';
import { QuoteOptions } from 'features/quote';
import { MessageOptions } from 'features/message';
import { BackgroundOptions } from 'features/background';
import { SearchOptions } from 'features/search';
import { WeatherOptions } from 'features/weather';
import { Stats } from 'features/stats';
import {
  About,
  AdvancedOptions,
  AppearanceOptions,
  Changelog,
  ExperimentalOptions,
  LanguageOptions,
  Overview,
} from '../sections';

const sections = [
  { label: 'modals.main.marketplace.product.overview', name: 'order', component: Overview },
  {
    label: 'modals.main.settings.sections.appearance.navbar.title',
    name: 'navbar',
    component: NavbarOptions,
  },
  {
    label: 'modals.main.settings.sections.greeting.title',
    name: 'greeting',
    component: GreetingOptions,
  },
  { label: 'modals.main.settings.sections.time.title', name: 'time', component: TimeOptions },
  {
    label: 'modals.main.settings.sections.quicklinks.title',
    name: 'quicklinks',
    component: QuickLinksOptions,
  },
  { label: 'modals.main.settings.sections.quote.title', name: 'quote', component: QuoteOptions },
  { label: 'modals.main.settings.sections.date.title', name: 'date', component: DateOptions },
  {
    label: 'modals.main.settings.sections.message.title',
    name: 'message',
    component: MessageOptions,
  },
  {
    label: 'modals.main.settings.sections.background.title',
    name: 'background',
    component: BackgroundOptions,
  },
  { label: 'modals.main.settings.sections.search.title', name: 'search', component: SearchOptions },
  {
    label: 'modals.main.settings.sections.weather.title',
    name: 'weather',
    component: WeatherOptions,
  },
  {
    label: 'modals.main.settings.sections.appearance.title',
    name: 'appearance',
    component: AppearanceOptions,
  },
  {
    label: 'modals.main.settings.sections.language.title',
    name: 'language',
    component: LanguageOptions,
  },
  {
    label: 'modals.main.settings.sections.advanced.title',
    name: 'advanced',
    component: AdvancedOptions,
  },
  { label: 'modals.main.settings.sections.stats.title', name: 'stats', component: Stats },
  {
    label: 'modals.main.settings.sections.experimental.title',
    name: 'experimental',
    component: ExperimentalOptions,
  },
  {
    label: 'modals.main.settings.sections.changelog.title',
    name: 'changelog',
    component: Changelog,
  },
  { label: 'modals.main.settings.sections.about.title', name: 'about', component: About },
];

function Settings(props) {
  return (
    <Tabs changeTab={(type) => props.changeTab(type)} current="settings" currentTab={props.currentTab}>
      {sections.map(({ label, name, component: Component }) => (
        <div key={name} label={variables.getMessage(label)} name={name}>
          <Component />
        </div>
      ))}
    </Tabs>
  );
}

export default memo(Settings);
