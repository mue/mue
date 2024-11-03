import { useState, useEffect } from 'react';
import { MdOutlineDragIndicator } from 'react-icons/md';
import { sortableContainer, sortableElement } from '@muetab/react-sortable-hoc';
import { toast } from 'react-toastify';

import variables from 'config/variables';
import Greeting from './overview_skeletons/Greeting';
import Clock from './overview_skeletons/Clock';
import Quote from './overview_skeletons/Quote';
import QuickLinks from './overview_skeletons/QuickLinks';
import Date from './overview_skeletons/Date';
import Message from './overview_skeletons/Message';

import EventBus from 'utils/eventbus';

import defaults from 'config/default';
import { PreferencesWrapper } from 'components/Layout';

const widget_name = {
  greeting: variables.getMessage('settings:sections.greeting.title'),
  time: variables.getMessage('settings:sections.time.title'),
  quicklinks: variables.getMessage('settings:sections.quicklinks.title'),
  quote: variables.getMessage('settings:sections.quote.title'),
  date: variables.getMessage('settings:sections.date.title'),
  message: variables.getMessage('settings:sections.message.title'),
};

const SortableItem = sortableElement(({ value }) => (
  <li className="sortableItem">
    {widget_name[value]}
    <MdOutlineDragIndicator />
  </li>
));

const SortableContainer = sortableContainer(({ children }) => (
  <ul className="sortableContainer">{children}</ul>
));

const Overview = () => {
  const [items, setItems] = useState(
    () => JSON.parse(localStorage.getItem('order')) || defaults.order,
  );

  const arrayMove = (array, oldIndex, newIndex) => {
    const result = Array.from(array);
    const [removed] = result.splice(oldIndex, 1);
    result.splice(newIndex, 0, removed);
    return result;
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setItems((prevItems) => arrayMove(prevItems, oldIndex, newIndex));
  };

  const reset = () => {
    localStorage.setItem('order', JSON.stringify(defaults.order));
    setItems(defaultOrder);
    toast(variables.getMessage('toasts.reset'));
  };

  const enabled = (setting) => {
    switch (setting) {
      case 'quicklinks':
        return localStorage.getItem('quicklinksenabled') !== 'false';
      default:
        return localStorage.getItem(setting) !== 'false';
    }
  };

  const getTab = (value) => {
    switch (value) {
      case 'greeting':
        return <Greeting />;
      case 'time':
        return <Clock />;
      case 'quicklinks':
        return <QuickLinks />;
      case 'quote':
        return <Quote />;
      case 'date':
        return <Date />;
      case 'message':
        return <Message />;
      default:
        return null;
    }
  };

  useEffect(() => {
    localStorage.setItem('order', JSON.stringify(items));
    EventBus.emit('refresh', 'widgets');
  }, [items]);

  return (
    <PreferencesWrapper>
      <span className="mainTitle">{variables.getMessage('marketplace:product.overview')}</span>
      <div className="overviewGrid">
        <div>
          <span className="title">{variables.getMessage('welcome:buttons.preview')}</span>
          <div className="tabPreview">
            <div className="previewItem" style={{ maxWidth: '50%' }}>
              {items.map((value, index) => {
                if (!enabled(value)) {
                  return null;
                }
                return (
                  <div className="previewItem" key={`item-${value}`} index={index}>
                    {getTab(value)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div>
          <span className="title">{variables.getMessage('settings:sections.order.title')}</span>
          <SortableContainer
            onSortEnd={onSortEnd}
            lockAxis="y"
            lockToContainerEdges
            disableAutoscroll
          >
            {items.map((value, index) => {
              if (!enabled(value)) {
                return null;
              }
              return <SortableItem key={`item-${value}`} index={index} value={value} />;
            })}
          </SortableContainer>
        </div>
      </div>
    </PreferencesWrapper>
  );
};

export { Overview as default, Overview };
