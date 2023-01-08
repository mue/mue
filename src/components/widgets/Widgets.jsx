import { PureComponent, Fragment, Suspense, lazy } from 'react';

import Clock from './time/Clock';
import Greeting from './greeting/Greeting';
import Quote from './quote/Quote';
import Search from './search/Search';
import QuickLinks from './quicklinks/QuickLinks';
import Date from './time/Date';
import Message from './message/Message';

import EventBus from 'modules/helpers/eventbus';

// weather is lazy loaded due to the size of the weather icons module
// since we're using react-icons this might not be accurate,
// however, when we used the original module https://bundlephobia.com/package/weather-icons-react@1.2.0
// as seen here it is ridiculously large
const Weather = lazy(() => import('./weather/Weather'));

export default class Widgets extends PureComponent {
  online = localStorage.getItem('offlineMode') === 'false';
  constructor() {
    super();
    this.state = {
      order: JSON.parse(localStorage.getItem('order')),
      welcome: localStorage.getItem('showWelcome'),
    };
    // widgets we can re-order
    this.widgets = {
      time: this.enabled('time') ? <Clock /> : null,
      greeting: this.enabled('greeting') ? <Greeting /> : null,
      quote: this.enabled('quote') ? <Quote /> : null,
      date: this.enabled('date') ? <Date /> : null,
      quicklinks: this.enabled('quicklinksenabled') && this.online ? <QuickLinks /> : null,
      message: this.enabled('message') ? <Message /> : null,
    };
  }

  enabled(key) {
    return localStorage.getItem(key) === 'true';
  }

  componentDidMount() {
    EventBus.on('refresh', (data) => {
      switch (data) {
        case 'widgets':
          return this.setState({
            order: JSON.parse(localStorage.getItem('order')),
          });
        case 'widgetsWelcome':
          this.setState({
            welcome: localStorage.getItem('showWelcome'),
          });
          localStorage.setItem('showWelcome', true);
          window.onbeforeunload = () => {
            localStorage.clear();
          };
          break;
        case 'widgetsWelcomeDone':
          this.setState({
            welcome: localStorage.getItem('showWelcome'),
          });
          return (window.onbeforeunload = null);
        default:
          break;
      }
    });
  }

  componentWillUnmount() {
    EventBus.off('refresh');
  }

  render() {
    // don't show when welcome is there
    return this.state.welcome !== 'false' ? (
      <div id="widgets" />
    ) : (
      <div id="widgets">
        <Suspense fallback={<></>}>
          {this.enabled('searchBar') ? <Search /> : null}
          {this.state.order.map((element, key) => (
            <Fragment key={key}>{this.widgets[element]}</Fragment>
          ))}
          {this.enabled('weatherEnabled') && this.online ? <Weather /> : null}
        </Suspense>
      </div>
    );
  }
}
