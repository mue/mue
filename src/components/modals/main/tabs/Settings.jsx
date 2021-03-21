import React from 'react';

import About from '../settings/sections/About';
import Language from '../settings/sections/Language';
import Search from '../settings/sections/Search';
import Greeting from '../settings/sections/Greeting';
import Time from '../settings/sections/Time';
import Quote from '../settings/sections/Quote';
import Appearance from '../settings/sections/Appearance';
import Background from '../settings/sections/Background';
import Advanced from '../settings/sections/Advanced';
import Changelog from '../settings/sections/Changelog';
import Order from '../settings/sections/Order';

import SettingsTabs from './backend/Tabs';

export default function Settings () {
  const language = window.language.modals.main.settings.sections;

  return (
    <React.Fragment>
      <SettingsTabs>
        <div label={language.time.title}><Time/></div>
        <div label={language.quote.title}><Quote/></div>
        <div label={language.greeting.title}><Greeting/></div>
        <div label={language.background.title}><Background/></div>
        <div label={language.search.title}><Search/></div>
        <div label={language.appearance.title}><Appearance/></div>
        <div label='Order'><Order/></div>
        <div label={language.language.title}><Language/></div>
        <div label={language.advanced.title}><Advanced/></div>
        <div label='Experimental'></div>
        <div label={language.changelog}><Changelog/></div>
        <div label={language.about.title}><About/></div>
      </SettingsTabs>
      <div className='reminder-info'>
        <h1>IMPORTANT INFO</h1>
        <p>In order for changes to take place, the page must be refreshed.</p>
      </div>
    </React.Fragment>
  );
}
