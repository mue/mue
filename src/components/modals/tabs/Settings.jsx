import React from 'react';

import About from '../settings/sections/About';
import Language from '../settings/sections/Language';
import Search from '../settings/sections/Search';
import Greeting from '../settings/sections/Greeting';
import Time from '../settings/sections/Time';
import Quote from '../settings/sections/Quote';
import Appearance from '../settings/sections/Appearance';
import Background from '../settings/sections/Background';

import SettingsTabs from '../tabs-backend/Tabs';

export default class Settings extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <SettingsTabs>
          <div label='Time'>
            <Time language={this.props.language}/>
          </div>
          <div label='Quote'>
            <Quote language={this.props.language}/>
          </div>
          <div label='Greeting'>
            <Greeting language={this.props.language}/>
          </div>
          <div label='Background'>
            <Background language={this.props.language}/>
          </div>
          <div label='Search'>
            <Search language={this.props.language}/>
          </div>
          <div label='Appearance'>
            <Appearance language={this.props.language}/>
          </div>
          <div label='Language'>
            <Language language={this.props.language}/>
          </div>
          <div label='Change Log'>
            <About/>
          </div>
          <div label='About'>
            <About/>
          </div>
        </SettingsTabs>
      </React.Fragment>
    );
  }
}
