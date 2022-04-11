import variables from 'modules/variables';
import Tabs from './backend/Tabs';

import Navbar from '../settings/sections/Navbar';
import Greeting from '../settings/sections/Greeting';
import Time from '../settings/sections/Time';
import QuickLinks from '../settings/sections/QuickLinks';
import Quote from '../settings/sections/Quote';
import Date from '../settings/sections/Date';
import Reminder from '../settings/sections/Reminder';
import Message from '../settings/sections/Message';
import Background from '../settings/sections/background/Background';
import Search from '../settings/sections/Search';
import Weather from '../settings/sections/Weather';
import Order from '../settings/sections/Order';
import Appearance from '../settings/sections/Appearance';
import Language from '../settings/sections/Language';
import Advanced from '../settings/sections/Advanced';
//import Keybinds from '../settings/sections/Keybinds';
import Stats from '../settings/sections/Stats';
import Experimental from '../settings/sections/Experimental';
import Changelog from '../settings/sections/Changelog';
import About from '../settings/sections/About';

export default function Settings(props) {
  const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

  return (
    <Tabs changeTab={(type) => props.changeTab(type)} current="settings">
      <div
        label={getMessage('modals.main.settings.sections.appearance.navbar.title')}
        name="navbar"
      >
        <Navbar />
      </div>
      <div label={getMessage('modals.main.settings.sections.greeting.title')} name="greeting">
        <Greeting />
      </div>
      <div label={getMessage('modals.main.settings.sections.time.title')} name="time">
        <Time />
      </div>
      <div label={getMessage('modals.main.settings.sections.quicklinks.title')} name="quicklinks">
        <QuickLinks />
      </div>
      <div label={getMessage('modals.main.settings.sections.quote.title')} name="quote">
        <Quote />
      </div>
      <div label={getMessage('modals.main.settings.sections.date.title')} name="date">
        <Date />
      </div>
      <div label="Reminder" name="reminder">
        <Reminder />
      </div>
      <div label={getMessage('modals.main.settings.sections.message.title')} name="message">
        <Message />
      </div>
      <div label={getMessage('modals.main.settings.sections.background.title')} name="background">
        <Background />
      </div>
      <div label={getMessage('modals.main.settings.sections.search.title')} name="search">
        <Search />
      </div>
      <div label={getMessage('modals.main.settings.sections.weather.title')} name="weather">
        <Weather />
      </div>

      <div label={getMessage('modals.main.settings.sections.order.title')} name="order">
        <Order />
      </div>
      <div label={getMessage('modals.main.settings.sections.appearance.title')} name="appearance">
        <Appearance />
      </div>
      <div label={getMessage('modals.main.settings.sections.language.title')} name="language">
        <Language />
      </div>
      <div label={getMessage('modals.main.settings.sections.advanced.title')} name="advanced">
        <Advanced />
      </div>
      {/*<div label={getMessage('modals.main.settings.sections.keybinds.title')} name='keybinds'><Keybinds/></div>*/}
      <div label={getMessage('modals.main.settings.sections.stats.title')} name="stats">
        <Stats />
      </div>
      <div
        label={getMessage('modals.main.settings.sections.experimental.title')}
        name="experimental"
      >
        <Experimental />
      </div>
      <div label={getMessage('modals.main.settings.sections.changelog.title')} name="changelog">
        <Changelog />
      </div>
      <div label={getMessage('modals.main.settings.sections.about.title')} name="about">
        <About />
      </div>
    </Tabs>
  );
}
