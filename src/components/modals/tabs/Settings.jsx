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

import SettingsTabs from './backend/Tabs';

export default function Settings (props) {
  return (
    <React.Fragment>
      <SettingsTabs>
        <div label={props.language.sections.time.title}>
          <Time language={props.language}/>
        </div>
        <div label={props.language.sections.quote.title}>
          <Quote language={props.language}/>
        </div>
        <div label={props.language.sections.greeting.title}>
          <Greeting language={props.language}/>
        </div>
        <div label={props.language.sections.background.title}>
          <Background language={props.language}/>
        </div>
        <div label={props.language.sections.search.title}>
          <Search language={props.language}/>
        </div>
        <div label={props.language.sections.appearance.title}>
          <Appearance language={props.language}/>
        </div>
        <div label={props.language.sections.language.title}>
          <Language language={props.language.sections.language}/>
        </div>
        <div label={props.language.sections.advanced.title}>
          <Advanced language={props.language}/>
        </div>
        <div label='Experimental'>

        </div>
        <div label={props.language.sections.changelog}>
          <Changelog language={props.updateLanguage} />
        </div>
        <div label={props.language.sections.about.title}>
          <About language={props.language.sections.about}/>
        </div>
      </SettingsTabs>
    </React.Fragment>
  );
}
