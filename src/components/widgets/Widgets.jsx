import React from 'react';

import Clock from './time/Clock';
import Greeting from './greeting/Greeting';
import Quote from './quote/Quote';
import Search from './search/Search';
import Maximise from './background/Maximise';
import Favourite from './background/Favourite';
import Date from './time/Date';

export default class Widgets extends React.PureComponent {
   enabled(key) {
    const stringValue = localStorage.getItem(key);
    let enabled = true;

    if (stringValue !== null) {
      if (stringValue === 'true') {
        enabled = true;
      }

      if (stringValue === 'false') { 
        enabled = false;
      }
    }

    return enabled;
  }

  render() {
    const { language, languagecode } = this.props;
    const enabled = this.enabled;

    return (
      <React.Fragment>
          {enabled('searchBar') ? <Search language={language.widgets.search} /> : null}
          {enabled('greeting') ? <Greeting language={language.widgets.greeting} /> : null}
          {enabled('time') ? <Clock/> : null}
          {enabled('date') ? <Date/> : null}
          {enabled('quote') ? <Quote language={language.toasts} languagecode={languagecode} /> : null}
          {enabled('view') ? <Maximise/> : null}
          {enabled('favouriteEnabled') ? <Favourite/> : null}
      </React.Fragment>
    );
  }
}
