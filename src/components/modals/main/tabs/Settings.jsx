import React from 'react';

import About from '../settings/sections/About';
import Language from '../settings/sections/Language';
import Search from '../settings/sections/Search';
import Greeting from '../settings/sections/Greeting';
import Time from '../settings/sections/Time';
import Quote from '../settings/sections/Quote';
import Appearance from '../settings/sections/Appearance';
import Background from '../settings/sections/background/Background';
import Advanced from '../settings/sections/Advanced';
import Changelog from '../settings/sections/Changelog';
import Order from '../settings/sections/Order';
import Experimental from '../settings/sections/Experimental';
import QuickLinks from '../settings/sections/QuickLinks';
import Weather from '../settings/sections/Weather';

import Tabs from './backend/Tabs';

export default function Settings() {
  const settings = window.language.modals.main.settings.sections;

  return (
    <>
      <Tabs>
        <div label={settings.time.title}><Time/></div>
        <div label={settings.quote.title}><Quote/></div>
        <div label={settings.greeting.title}><Greeting/></div>
        <div label={settings.background.title}><Background/></div>
        <div label={settings.search.title}><Search/></div>
        <div label={settings.quicklinks.title}><QuickLinks/></div>
        <div label={settings.weather.title}><Weather/></div>
        <div label={settings.appearance.title}><Appearance/></div>
        <div label={settings.order.title}><Order/></div>
        <div label={settings.language.title}><Language/></div>
        <div label={settings.advanced.title}><Advanced/></div>
        <div label={settings.experimental.title}><Experimental/></div>
        <div label={settings.changelog}><Changelog/></div>
        <div label={settings.about.title}><About/></div>
      </Tabs>
      <div className='reminder-info'>
        <h1>IMPORTANT INFO</h1>
        <p>In order for changes to take place, the page must be refreshed.</p>
      </div>
    </>
  );
}
