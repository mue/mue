import React from 'react';

const Clock = React.lazy(() => import('./time/Clock'));
const Greeting = React.lazy(() => import('./greeting/Greeting'));
const Quote = React.lazy(() => import('./quote/Quote'));
const Search = React.lazy(() => import('./search/Search'));
const Date = React.lazy(() => import('./time/Date'));
const QuickLinks = React.lazy(() => import('./quicklinks/QuickLinks'));
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

  componentDidMount() {
    const widget = document.getElementById('widgets');
    // These lines of code prevent double clicking the page or pressing CTRL + A from highlighting the page
    widget.addEventListener('mousedown', (event) => {
      if (event.detail > 1) {
        event.preventDefault();
      }
    }, false);

    document.onkeydown = (e) => {
      e = e || window.event;
      if (!e.ctrlKey) {
        return;
      }
      let code = e.which || e.keyCode;
      
      const modals = document.getElementsByClassName('ReactModal__Overlay');
      if (modals.length > 0) {
        return;
      }

      switch (code) {
        case 65:
          e.preventDefault();
          e.stopPropagation();
          break;
        default: break;
      }
    };
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
          {this.enabled('weatherEnabled') && (localStorage.getItem('offlineMode') === 'false') ? <Weather/> : null}
        </React.Suspense>
      </div>
    );
  }
}
