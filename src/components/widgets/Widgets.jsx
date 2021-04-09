import React from 'react';

import Clock from './time/Clock';
import Greeting from './greeting/Greeting';
import Quote from './quote/Quote';
import Search from './search/Search';
import Date from './time/Date';
import QuickLinks from './quicklinks/QuickLinks';
import Weather from './weather/Weather';

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
        {this.enabled('searchBar') ? <Search/> : null}
        {elements}
        {this.enabled('weatherEnabled') ? <Weather/> : null}
      </div>
    );
  }
}
