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

import Tabs from './backend/Tabs';

export default function Settings() {
  const { reminder, sections } = window.language.modals.main.settings;

  let display = 'none';
  if (localStorage.getItem('showReminder') === 'true') {
    display = 'block';
  }

  return (
    <>
      <Tabs>
        <div label={sections.time.title} name='time'><Time/></div>
        <div label={sections.quote.title} name='quote'><Quote/></div>
        <div label={sections.greeting.title} name='greeting'><Greeting/></div>
        <div label={sections.background.title} name='background'><Background/></div>
        <div label={sections.search.title} name='search'><Search/></div>
        <div label={sections.quicklinks.title} name='quicklinks'><QuickLinks/></div>
        <div label={sections.weather.title} name='weather'><Weather/></div>
        <div label={sections.appearance.title} name='appearance'><Appearance/></div>
        <div label={sections.order.title} name='order'><Order/></div>
        <div label={sections.language.title} name='language'><Language/></div>
        <div label={sections.advanced.title} name='advanced'><Advanced/></div>
        <div label='Stats' name='stats'><Stats/></div>
        <div label={sections.experimental.title} name='experimental'><Experimental/></div>
        <div label={sections.changelog} name='changelog'><Changelog/></div>
        <div label={sections.about.title} name='about'><About/></div>
      </Tabs>
      <div className='reminder-info' style={{ display: display }}>
        <h1>{reminder.title}</h1>
        <p>{reminder.message}</p>
        <button className='pinNote' onClick={() => window.location.reload()}>{window.language.modals.main.error_boundary.refresh}</button>
      </div>
    </>
  );
}
