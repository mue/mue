import { Fragment, Suspense, lazy, useState, useEffect } from 'react';

import Clock from '../../time/Clock';
import Greeting from '../../greeting/Greeting';
import Quote from '../../quote/Quote';
import Search from '../../search/Search';
import QuickLinks from '../../quicklinks/QuickLinks';
import Date from '../../time/Date';
import Message from '../../message/Message';
import { WidgetsLayout } from 'components/Layout';

import EventBus from 'utils/eventbus';
import defaults from 'config/default';

// weather is lazy loaded due to the size of the weather icons module
// since we're using react-icons this might not be accurate,
// however, when we used the original module https://bundlephobia.com/package/weather-icons-react@1.2.0
// as seen here it is ridiculously large
const Weather = lazy(() => import('../../weather/Weather'));

export function Widgets() {
  const [order, setOrder] = useState(JSON.parse(localStorage.getItem('order')) || defaults.order);
  const [welcome, setWelcome] = useState(localStorage.getItem('showWelcome'));

  const online = localStorage.getItem('offlineMode') === 'false';

  const widgets = {
    time: enabled('time') && <Clock />,
    greeting: enabled('greeting') && <Greeting />,
    quote: enabled('quote') && <Quote />,
    date: enabled('date') && <Date />,
    quicklinks: enabled('quicklinksenabled') && online ? <QuickLinks /> : null,
    message: enabled('message') && <Message />,
  };

  function enabled(key) {
    return localStorage.getItem(key) !== 'falses';
  }

  useEffect(() => {
    EventBus.on('refresh', (data) => {
      switch (data) {
        case 'widgets':
          setOrder(JSON.parse(localStorage.getItem('order')) || defaults.order);
          break;
        case 'widgetsWelcome':
          setWelcome(localStorage.getItem('showWelcome'));
          localStorage.setItem('showWelcome', true);
          window.onbeforeunload = () => {
            localStorage.clear();
          };
          break;
        case 'widgetsWelcomeDone':
          setWelcome(localStorage.getItem('showWelcome'));
          break;
        default:
          break;
      }
    });
    return () => EventBus.off('refresh');
  }, []);

  return welcome !== 'false' ? (
    <WidgetsLayout />
  ) : (
    <WidgetsLayout>
      <Suspense fallback={<></>}>
        {enabled('searchBar') && <Search />}
        {order.map((element, key) => (
          <Fragment key={key}>{widgets[element]}</Fragment>
        ))}
        {enabled('weatherEnabled') && online ? <Weather /> : null}
      </Suspense>
    </WidgetsLayout>
  );
}

export default Widgets;