import React from 'react';

import EventBus from '../../modules/helpers/eventbus';

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
    this.state = {
      order: JSON.parse(localStorage.getItem('order'))
    };
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

  componentDidMount() {
    EventBus.on('refresh', (data) => {
      if (data === 'widgets') {
        this.setState({
          order: JSON.parse(localStorage.getItem('order'))
        });
      }
    });
  }

  render() {
    // don't show when welcome is there
    if (localStorage.getItem('showWelcome') !== 'false') {
      return <div id='widgets'></div>;
    }

    // allow for re-ordering widgets
    let elements = [];

    if (this.state.order) {
      this.state.order.forEach((element) => {
        elements.push(<React.Fragment key={element}>{this.widgets[element]}</React.Fragment>);
      });
    } else {
      // prevent error
      elements = [<Greeting/>, <Clock/>, <QuickLinks/>, <Quote/>, <Date/>];
    }

    return (
      <div id='widgets'>
        <React.Suspense fallback={renderLoader()}>
          {this.enabled('searchBar') ? <Search/> : null}
          {elements}
          {this.enabled('weatherEnabled') && (localStorage.getItem('offlineMode') === 'false') ? <Weather/> : null}
        </React.Suspense>
      </div>
    );
  }
}
