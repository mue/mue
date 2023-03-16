import variables from 'modules/variables';
import { memo } from 'react';
import PropTypes from 'prop-types';

import Tabs from './backend/Tabs';

import Overview from '../settings/sections/Overview';
import Navbar from '../settings/sections/Navbar';
import Greeting from '../settings/sections/Greeting';
import Time from '../settings/sections/Time';
import QuickLinks from '../settings/sections/QuickLinks';
import Quote from '../settings/sections/Quote';
import Date from '../settings/sections/Date';
import Message from '../settings/sections/Message';
import Background from '../settings/sections/background/Background';
import Search from '../settings/sections/Search';
import Weather from '../settings/sections/Weather';
import Appearance from '../settings/sections/Appearance';
import Language from '../settings/sections/Language';
import Advanced from '../settings/sections/advanced/Advanced';
import Stats from '../settings/sections/Stats';
import Experimental from '../settings/sections/Experimental';
import Changelog from '../settings/sections/Changelog';
import About from '../settings/sections/About';

function Settings(props) {
  return (
    <Tabs changeTab={(type) => props.changeTab(type)} current="settings">
      <div label={variables.getMessage('modals.main.marketplace.product.overview')} name="order">
        <Overview />
      </div>
      <div
        label={variables.getMessage('modals.main.settings.sections.appearance.navbar.title')}
        name="navbar"
      >
        <Navbar />
      </div>
      <div
        label={variables.getMessage('modals.main.settings.sections.greeting.title')}
        name="greeting"
      >
        <Greeting />
      </div>
      <div label={variables.getMessage('modals.main.settings.sections.time.title')} name="time">
        <Time />
      </div>
      <div
        label={variables.getMessage('modals.main.settings.sections.quicklinks.title')}
        name="quicklinks"
      >
        <QuickLinks />
      </div>
      <div label={variables.getMessage('modals.main.settings.sections.quote.title')} name="quote">
        <Quote />
      </div>
      <div label={variables.getMessage('modals.main.settings.sections.date.title')} name="date">
        <Date />
      </div>
      <div
        label={variables.getMessage('modals.main.settings.sections.message.title')}
        name="message"
      >
        <Message />
      </div>
      <div
        label={variables.getMessage('modals.main.settings.sections.background.title')}
        name="background"
      >
        <Background />
      </div>
      <div label={variables.getMessage('modals.main.settings.sections.search.title')} name="search">
        <Search />
      </div>
      <div
        label={variables.getMessage('modals.main.settings.sections.weather.title')}
        name="weather"
      >
        <Weather />
      </div>
      <div
        label={variables.getMessage('modals.main.settings.sections.appearance.title')}
        name="appearance"
      >
        <Appearance />
      </div>
      <div
        label={variables.getMessage('modals.main.settings.sections.language.title')}
        name="language"
      >
        <Language />
      </div>
      <div
        label={variables.getMessage('modals.main.settings.sections.advanced.title')}
        name="advanced"
      >
        <Advanced />
      </div>
      <div label={variables.getMessage('modals.main.settings.sections.stats.title')} name="stats">
        <Stats />
      </div>
      <div
        label={variables.getMessage('modals.main.settings.sections.experimental.title')}
        name="experimental"
      >
        <Experimental />
      </div>
      <div
        label={variables.getMessage('modals.main.settings.sections.changelog.title')}
        name="changelog"
      >
        <Changelog />
      </div>
      <div label={variables.getMessage('modals.main.settings.sections.about.title')} name="about">
        <About />
      </div>
    </Tabs>
  );
}

Settings.propTypes = {
  changeTab: PropTypes.func.isRequired,
};

export default memo(Settings);
