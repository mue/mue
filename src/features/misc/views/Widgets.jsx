import { Fragment, Suspense, lazy, useState, useEffect, useCallback, useMemo } from 'react';
import Clock from '../../time/Clock';
import Greeting from '../../greeting/Greeting';
import Quote from '../../quote/Quote';
import Search from '../../search/Search';
import QuickLinks from '../../quicklinks/QuickLinks';
import Date from '../../date/Date';
import Message from '../../message/Message';
import { WidgetsLayout } from 'components/Layout';
import EventBus from 'utils/eventbus';
import defaults from 'config/default';

// weather is lazy loaded due to the size of the weather icons module
const Weather = lazy(() => import('../../weather/Weather'));

const Widgets = () => {
  const [order, setOrder] = useState(
    () => JSON.parse(localStorage.getItem('order')) || defaults.order,
  );
  const [welcome, setWelcome] = useState(() => localStorage.getItem('showWelcome'));
  const online = useMemo(() => localStorage.getItem('offlineMode') === 'false', []);

  const enabled = useCallback((key) => localStorage.getItem(key) !== 'false', []);

  const widgets = useMemo(
    () => ({
      time: enabled('time') && <Clock />,
      greeting: enabled('greeting') && <Greeting />,
      quote: enabled('quote') && <Quote />,
      date: enabled('date') && <Date />,
      quicklinks: enabled('quicklinksenabled') && online ? <QuickLinks /> : null,
      message: enabled('message') && <Message />,
    }),
    [enabled, online],
  );

  useEffect(() => {
    const handleRefresh = (data) => {
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
    };

    EventBus.on('refresh', handleRefresh);
    return () => EventBus.off('refresh', handleRefresh);
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
};

export default Widgets;
