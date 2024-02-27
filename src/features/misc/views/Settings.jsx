import variables from 'config/variables';
import { memo } from 'react';

import Tabs from '../../../components/Elements/MainModal/backend/Tabs';

import Overview from '../modals/main/settings/sections/Overview';
import { NavbarOptions } from 'features/navbar';
import { GreetingOptions } from 'features/greeting';
import { TimeOptions, DateOptions } from 'features/time';
import { QuickLinksOptions } from 'features/quicklinks';
import { QuoteOptions } from 'features/quote';
import { MessageOptions } from 'features/message';
import { BackgroundOptions } from 'features/background';
import { SearchOptions } from 'features/search';
import { WeatherOptions } from 'features/weather';
import Appearance from '../modals/main/settings/sections/Appearance';
import Language from '../modals/main/settings/sections/Language';
import Advanced from '../modals/main/settings/sections/Advanced';
import Stats from '../modals/main/settings/sections/Stats';
import Experimental from '../modals/main/settings/sections/Experimental';
import Changelog from '../modals/main/settings/sections/Changelog';
import About from '../modals/main/settings/sections/About';

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
    component: Appearance,
  },
  { label: 'modals.main.settings.sections.language.title', name: 'language', component: Language },
  { label: 'modals.main.settings.sections.advanced.title', name: 'advanced', component: Advanced },
  { label: 'modals.main.settings.sections.stats.title', name: 'stats', component: Stats },
  {
    label: 'modals.main.settings.sections.experimental.title',
    name: 'experimental',
    component: Experimental,
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
    <Tabs changeTab={(type) => props.changeTab(type)} current="settings">
      {sections.map(({ label, name, component: Component }) => (
        <div key={name} label={variables.getMessage(label)} name={name}>
          <Component />
        </div>
      ))}
    </Tabs>
  );
}

export default memo(Settings);
