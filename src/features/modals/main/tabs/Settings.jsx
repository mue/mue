import variables from 'config/variables';
import { memo } from 'react';

import Tabs from './backend/Tabs';

import Overview from '../settings/sections/Overview';
import Navbar from '../settings/sections/Navbar';
import { GreetingOptions } from 'features/widgets/greeting';
import Time from '../settings/sections/Time';
import { QuickLinksOptions } from 'features/widgets/quicklinks';
import Quote from '../settings/sections/Quote';
import Date from '../settings/sections/Date';
import { MessageOptions } from 'features/widgets/message';
import Background from '../settings/sections/background/Background';
import { SearchOptions } from 'features/widgets/search';
import { WeatherOptions } from 'features/widgets/weather';
import Appearance from '../settings/sections/Appearance';
import Language from '../settings/sections/Language';
import Advanced from '../settings/sections/Advanced';
import Stats from '../settings/sections/Stats';
import Experimental from '../settings/sections/Experimental';
import Changelog from '../settings/sections/Changelog';
import About from '../settings/sections/About';

const sections = [
  { label: 'modals.main.marketplace.product.overview', name: 'order', component: Overview },
  { label: 'modals.main.settings.sections.appearance.navbar.title', name: 'navbar', component: Navbar },
  { label: 'modals.main.settings.sections.greeting.title', name: 'greeting', component: GreetingOptions },
  { label: 'modals.main.settings.sections.time.title', name: 'time', component: Time },
  { label: 'modals.main.settings.sections.quicklinks.title', name: 'quicklinks', component: QuickLinksOptions },
  { label: 'modals.main.settings.sections.quote.title', name: 'quote', component: Quote },
  { label: 'modals.main.settings.sections.date.title', name: 'date', component: Date },
  { label: 'modals.main.settings.sections.message.title', name: 'message', component: MessageOptions },
  { label: 'modals.main.settings.sections.background.title', name: 'background', component: Background },
  { label: 'modals.main.settings.sections.search.title', name: 'search', component: SearchOptions },
  { label: 'modals.main.settings.sections.weather.title', name: 'weather', component: WeatherOptions },
  { label: 'modals.main.settings.sections.appearance.title', name: 'appearance', component: Appearance },
  { label: 'modals.main.settings.sections.language.title', name: 'language', component: Language },
  { label: 'modals.main.settings.sections.advanced.title', name: 'advanced', component: Advanced },
  { label: 'modals.main.settings.sections.stats.title', name: 'stats', component: Stats },
  { label: 'modals.main.settings.sections.experimental.title', name: 'experimental', component: Experimental },
  { label: 'modals.main.settings.sections.changelog.title', name: 'changelog', component: Changelog },
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