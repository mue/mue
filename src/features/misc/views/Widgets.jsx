import { useState, useEffect, Fragment, Suspense, lazy, useMemo } from 'react';

import Clock from '../../time/Clock';
import Greeting from '../../greeting/Greeting';
import Quote from '../../quote/Quote';
import Search from '../../search/Search';
import QuickLinks from '../../quicklinks/QuickLinks';
import Date from '../../time/Date';
import Message from '../../message/Message';
import { WidgetsLayout } from 'components/Layout';

import EventBus from 'utils/eventbus';

// weather is lazy loaded due to the size of the weather icons module
// since we're using react-icons this might not be accurate,
// however, when we used the original module https://bundlephobia.com/package/weather-icons-react@1.2.0
// as seen here it is ridiculously large
const Weather = lazy(() => import('../../weather/Weather'));

const Widgets = () => {
  const online = localStorage.getItem('offlineMode') === 'false';
  const [order, setOrder] = useState(JSON.parse(localStorage.getItem('order')));
  const [welcome, setWelcome] = useState(localStorage.getItem('showWelcome'));

  const enabled = (key) => {
    return localStorage.getItem(key) === 'true';
  };

  // widgets we can re-order
  const widgets = useMemo(
    () => ({
      time: enabled('time') && <Clock />,
      greeting: enabled('greeting') && <Greeting />,
      quote: enabled('quote') && <Quote />,
      date: enabled('date') && <Date />,
      quicklinks: enabled('quicklinksenabled') && online ? <QuickLinks /> : null,
      message: enabled('message') && <Message />,
    }),
    [order], // Re-create widgets when order changes
  );

  useEffect(() => {
    const handleRefresh = (data) => {
      switch (data) {
        case 'widgets':
          return setOrder(JSON.parse(localStorage.getItem('order')));
        case 'widgetsWelcome':
          setWelcome(localStorage.getItem('showWelcome'));
          localStorage.setItem('showWelcome', true);
          window.onbeforeunload = () => {
            localStorage.clear();
          };
          break;
        case 'widgetsWelcomeDone':
          setWelcome(localStorage.getItem('showWelcome'));
          window.onbeforeunload = null;
          break;
        default:
          break;
      }
    };

    EventBus.on('refresh', handleRefresh);
    return () => {
      EventBus.off('refresh');
    };
  }, []);

  // don't show when welcome is there
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
};

export { Widgets as default, Widgets };
