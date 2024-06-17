import variables from 'config/variables';
import { memo } from 'react';

//import Tabs from 'components/Elements/MainModal/backend/Tabs';
import { Tabs } from 'components/Elements/MainModal/backend/newTabs';

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
  { label: 'marketplace:product.overview', name: 'order', component: Overview },
  {
    label: 'settings:sections.appearance.navbar.title',
    name: 'navbar',
    component: NavbarOptions,
  },
  {
    label: 'settings:sections.greeting.title',
    name: 'greeting',
    component: GreetingOptions,
  },
  { label: 'settings:sections.time.title', name: 'time', component: TimeOptions },
  {
    label: 'settings:sections.quicklinks.title',
    name: 'quicklinks',
    component: QuickLinksOptions,
  },
  { label: 'settings:sections.quote.title', name: 'quote', component: QuoteOptions },
  { label: 'settings:sections.date.title', name: 'date', component: DateOptions },
  {
    label: 'settings:sections.message.title',
    name: 'message',
    component: MessageOptions,
  },
  {
    label: 'settings:sections.background.title',
    name: 'background',
    component: BackgroundOptions,
  },
  { label: 'settings:sections.search.title', name: 'search', component: SearchOptions },
  {
    label: 'settings:sections.weather.title',
    name: 'weather',
    component: WeatherOptions,
  },
  {
    label: 'settings:sections.appearance.title',
    name: 'appearance',
    component: AppearanceOptions,
  },
  {
    label: 'settings:sections.language.title',
    name: 'language',
    component: LanguageOptions,
  },
  {
    label: 'settings:sections.advanced.title',
    name: 'advanced',
    component: AdvancedOptions,
  },
  { label: 'settings:sections.stats.title', name: 'stats', component: Stats },
  {
    label: 'settings:sections.experimental.title',
    name: 'experimental',
    component: ExperimentalOptions,
  },
  {
    label: 'settings:sections.changelog.title',
    name: 'changelog',
    component: Changelog,
  },
  { label: 'settings:sections.about.title', name: 'about', component: About },
];

function Settings(props) {
  return (
    <>
      <Tabs sections={sections} />
    </>
  );
}

export default memo(Settings);
