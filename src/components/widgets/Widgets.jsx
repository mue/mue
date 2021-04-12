import React from 'react';

import Clock from './time/Clock';
import Greeting from './greeting/Greeting';
import Quote from './quote/Quote';
import Search from './search/Search';
import QuickLinks from './quicklinks/QuickLinks';
import Date from './time/Date';

const Weather = React.lazy(() => import('./weather/Weather'));
const renderLoader = () => <></>;

export default class Widgets extends React.PureComponent {
  constructor() {
    super();
    // widgets we can re-order
    this.widgets = {
      time: this.enabled('time') ? <Clock/> : null,
      greeting: this.enabled('greeting') ? <Greeting/> : null,
      quote: this.enabled('quote') ? <Quote/> : null,
      date: this.enabled('date') ? <Date/> : null,
      quicklinks: this.enabled('quicklinksenabled') ? <QuickLinks/> : null
    };
  }

  enabled(key) {
    return (localStorage.getItem(key) === 'true');
  }

  render() {
    // allow for re-ordering widgets
    let elements = [];
    const order = JSON.parse(localStorage.getItem('order'));

    if (order) {
      order.forEach((element) => {
        elements.push(<React.Fragment key={element}>{this.widgets[element]}</React.Fragment>);
      });
    } else {
      elements = ['greeting', 'time', 'quicklinks', 'quote', 'date'];
    }

    return (
      <div id='widgets'>
        <React.Suspense fallback={renderLoader()}>
          {this.enabled('searchBar') ? <Search/> : null}
          {elements}
          {this.enabled('weatherEnabled') && !localStorage.getItem('offlineMode') ? <Weather/> : null}
        </React.Suspense>
      </div>
    );
  }
}
