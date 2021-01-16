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
    const old = localStorage.getItem(key);
    let val = true;

    if (old !== null) {
        if (old === 'true') val = true;
        if (old === 'false') val = false;
    }

    return val;
  }

  // Render all the components
  render() {
    const { language, languagecode } = this.props;
    const enabled = this.enabled;

    return (
      <React.Fragment>
          {enabled('searchBar') ? <Search language={language.search} /> : null}
          {enabled('greeting') ? <Greeting language={language.greeting} /> : null}
          {enabled('clock') ? <Clock/> : null}
          {enabled('date') ? <Date/> : null}
          {enabled('quote') ? <Quote language={language.toasts} languagecode={languagecode} /> : null}
          {enabled('view') ? <Maximise/> : null}
          {enabled('favouriteEnabled') ? <Favourite/> : null}
      </React.Fragment>
    );
  }
}
