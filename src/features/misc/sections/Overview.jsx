import { useState, useEffect, useCallback } from 'react';
import { MdOutlineDragIndicator } from 'react-icons/md';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'react-toastify';

import variables from 'config/variables';
import Greeting from './overview_skeletons/Greeting';
import Clock from './overview_skeletons/Clock';
import Quote from './overview_skeletons/Quote';
import QuickLinks from './overview_skeletons/QuickLinks';
import Date from './overview_skeletons/Date';
import Message from './overview_skeletons/Message';

import EventBus from 'utils/eventbus';

const widget_name = {
  greeting: variables.getMessage('modals.main.settings.sections.greeting.title'),
  time: variables.getMessage('modals.main.settings.sections.time.title'),
  quicklinks: variables.getMessage('modals.main.settings.sections.quicklinks.title'),
  quote: variables.getMessage('modals.main.settings.sections.quote.title'),
  date: variables.getMessage('modals.main.settings.sections.date.title'),
  message: variables.getMessage('modals.main.settings.sections.message.title'),
};

const SortableItem = ({ id }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners} className="sortableItem">
      {widget_name[id]}
      <MdOutlineDragIndicator />
    </li>
  );
};

const Overview = () => {
  const [items, setItems] = useState(
    () =>
      JSON.parse(localStorage.getItem('order')) || [
        'greeting',
        'time',
        'quicklinks',
        'quote',
        'date',
        'message',
      ],
  );
  const [news, setNews] = useState({
    title: '',
    date: '',
    description: '',
    link: '',
    linkText: '',
  });
  const [newsDone, setNewsDone] = useState(false);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const reset = () => {
    const defaultOrder = ['greeting', 'time', 'quicklinks', 'quote', 'date', 'message'];
    localStorage.setItem('order', JSON.stringify(defaultOrder));
    setItems(defaultOrder);
    toast(variables.getMessage('toasts.reset'));
  };

  const enabled = (setting) => {
    switch (setting) {
      case 'quicklinks':
        return localStorage.getItem('quicklinksenabled') === 'true';
      default:
        return localStorage.getItem(setting) === 'true';
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

  const getNews = useCallback(async () => {
    try {
      const response = await fetch(`${variables.constants.API_URL}/news`);
      const data = await response.json();
      data.date = new window.Date(data.date).toLocaleDateString(
        variables.languagecode.replace('_', '-'),
        { year: 'numeric', month: 'long', day: 'numeric' },
      );
      setNews(data);
      setNewsDone(true);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getNews();
  }, [getNews]);

  useEffect(() => {
    localStorage.setItem('order', JSON.stringify(items));
    variables.stats.postEvent('setting', 'Widget order');
    EventBus.emit('refresh', 'widgets');
  }, [items]);

  return (
    <>
      <span className="mainTitle">
        {variables.getMessage('modals.main.marketplace.product.overview')}
      </span>
      <div className="overviewGrid">
        <div>
          <span className="title">{variables.getMessage('modals.welcome.buttons.preview')}</span>
          <div className="tabPreview">
            <div className="previewItem" style={{ maxWidth: '50%' }}>
              {items.map((value, index) => {
                if (!enabled(value)) {
                  return null;
                }
                return (
                  <div className="previewItem" key={`item-${value}`}>
                    {getTab(value)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div>
          <span className="title">
            {variables.getMessage('modals.main.settings.sections.order.title')}
          </span>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
              <ul className="sortableContainer">
                {items.map((value) => {
                  if (!enabled(value)) {
                    return null;
                  }
                  return <SortableItem key={value} id={value} />;
                })}
              </ul>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </>
  );
};

export { Overview as default, Overview };
