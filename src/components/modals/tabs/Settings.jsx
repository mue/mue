import React from 'react';

import About from '../settings/sections/About';
import Language from '../settings/sections/Language';
import Search from '../settings/sections/Search';
import Greeting from '../settings/sections/Greeting';
import Time from '../settings/sections/Time';
import Quote from '../settings/sections/Quote';
import Appearance from '../settings/sections/Appearance';
import Background from '../settings/sections/Background';

import SettingsTabs from './backend/Tabs';

export default function Settings (props) {
    return (
      <React.Fragment>
        <SettingsTabs>
          <div label={props.language.sections.time.title}>
            <Time language={props.language.sections.time}/>
          </div>
          <div label={props.language.sections.quote.title}>
            <Quote language={props.language.sections.quote}/>
          </div>
          <div label={props.language.sections.greeting.title}>
            <Greeting language={props.language} toastLanguage={props.toastLanguage} />
          </div>
          <div label={props.language.sections.background.title}>
            <Background language={props.language} toastLanguage={props.toastLanguage}/>
          </div>
          <div label={props.language.sections.search.title}>
            <Search language={props.language}/>
          </div>
          <div label={props.language.sections.appearance}>
            <Appearance language={props.language} toastLanguage={props.toastLanguage}/>
          </div>
          <div label={props.language.sections.language}>
            <Language language={props.language}/>
          </div>
          <div label={props.language.sections.changelog}>
            <About/>
          </div>
          <div label={props.language.sections.about.title}>
            <About/>
          </div>
        </SettingsTabs>
      </React.Fragment>
    );
}