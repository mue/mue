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
  const { reminder, sections } = window.language.modals.main.settings;

  let display = 'none';
  if (localStorage.getItem('showReminder') === 'true') {
    display = 'block';
  }

  return (
    <>
      <Tabs>
        <div label={sections.time.title}><Time/></div>
        <div label={sections.quote.title}><Quote/></div>
        <div label={sections.greeting.title}><Greeting/></div>
        <div label={sections.background.title}><Background/></div>
        <div label={sections.search.title}><Search/></div>
        <div label={sections.quicklinks.title}><QuickLinks/></div>
        <div label={sections.weather.title}><Weather/></div>
        <div label={sections.appearance.title}><Appearance/></div>
        <div label={sections.order.title}><Order/></div>
        <div label={sections.language.title}><Language/></div>
        <div label={sections.advanced.title}><Advanced/></div>
        <div label={sections.experimental.title}><Experimental/></div>
        <div label={sections.changelog}><Changelog/></div>
        <div label={sections.about.title}><About/></div>
      </Tabs>
      <div className='reminder-info' style={{ 'display': display }}>
        <h1>{reminder.title}</h1>
        <p>{reminder.message}</p>
        <button className='pinNote' onClick={() => window.location.reload()}>{window.language.modals.main.error_boundary.refresh}</button>
      </div>
    </>
  );
}
