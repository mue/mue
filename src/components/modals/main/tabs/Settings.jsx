import variables from 'modules/variables';
import Tabs from './backend/Tabs';

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
import Stats from '../settings/sections/Stats';
import Keybinds from '../settings/sections/Keybinds';
import Message from '../settings/sections/Message';
import Date from '../settings/sections/Date';
import Navbar from '../settings/sections/Navbar';

export default function Settings() {
  const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

  return (
    <>
      <Tabs>
        <div label={getMessage('modals.main.settings.sections.appearance.navbar.title')} name='navbar'><Navbar/></div>
        <div label={getMessage('modals.main.settings.sections.greeting.title')} name='greeting'><Greeting/></div>
        <div label={getMessage('modals.main.settings.sections.time.title')} name='time'><Time/></div>
        <div label={getMessage('modals.main.settings.sections.quicklinks.title')} name='quicklinks'><QuickLinks/></div>
        <div label={getMessage('modals.main.settings.sections.quote.title')} name='quote'><Quote/></div>
        <div label={getMessage('modals.main.settings.sections.time.date.title')} name='date'><Date/></div>
        <div label={getMessage('modals.main.settings.sections.message.title')} name='message'><Message/></div>
        <div label={getMessage('modals.main.settings.sections.background.title')} name='background'><Background/></div>
        <div label={getMessage('modals.main.settings.sections.search.title')} name='search'><Search/></div>
        <div label={getMessage('modals.main.settings.sections.weather.title')} name='weather'><Weather/></div>
        <div label={getMessage('modals.main.settings.sections.order.title')} name='order'><Order/></div>
        <div label={getMessage('modals.main.settings.sections.appearance.title')} name='appearance'><Appearance/></div>
        <div label={getMessage('modals.main.settings.sections.language.title')} name='language'><Language/></div>
        <div label={getMessage('modals.main.settings.sections.advanced.title')} name='advanced'><Advanced/></div>
        <div label={getMessage('modals.main.settings.sections.keybinds.title')} name='keybinds'><Keybinds/></div>
        <div label={getMessage('modals.main.settings.sections.stats.title')} name='stats'><Stats/></div>
        <div label={getMessage('modals.main.settings.sections.experimental.title')} name='experimental'><Experimental/></div>
        <div label={getMessage('modals.main.settings.sections.changelog')} name='changelog'><Changelog/></div>
        <div label={getMessage('modals.main.settings.sections.about.title')} name='about'><About/></div>
      </Tabs>
    </>
  );
}
