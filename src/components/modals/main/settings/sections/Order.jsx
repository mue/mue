import React from 'react';

import EventBus from '../../../../../modules/helpers/eventbus';

import DragHandleIcon from '@material-ui/icons/DragIndicator';

import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import { toast } from 'react-toastify';

const enabled = (setting) => {
  switch (setting) {
    case 'quicklinks':
      return (localStorage.getItem('quicklinksenabled') === 'true');
    default:
      return (localStorage.getItem(setting) === 'true');
  }
};

const settings = window.language.modals.main.settings.sections;
const widget_name = {
  greeting: settings.greeting.title,
  time: settings.time.title,
  quicklinks: settings.quicklinks.title,
  quote: settings.quote.title,
  date: settings.time.date.title
};

const SortableItem = sortableElement(({ value }) => (
  <li className='sortableitem' style={{ display: enabled(value) ? 'block' : 'none' }}>
    <DragHandleIcon style={{ verticalAlign: 'middle' }} />
    {widget_name[value]}
  </li>
));
  
const SortableContainer = sortableContainer(({ children }) => {
  return <ul className='sortablecontainer'>{children}</ul>;
});

export default class OrderSettings extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      items: JSON.parse(localStorage.getItem('order'))
    };
    this.language = window.language.modals.main.settings;
  }

  // based on https://stackoverflow.com/a/48301905
  arrayMove(array, oldIndex, newIndex) {
    if (oldIndex === newIndex) {
      return array;
    }
  
    const newArray = [...array];
  
    const target = newArray[oldIndex];
    const inc = newIndex < oldIndex ? -1 : 1;
  
    for (let i = oldIndex; i !== newIndex; i += inc) {
      newArray[i] = newArray[i + inc];
    }
  
    newArray[newIndex] = target;
  
    return newArray;
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      items: this.arrayMove(this.state.items, oldIndex, newIndex)
    });
  }

  reset = () => {
    localStorage.setItem('order', JSON.stringify(['greeting', 'time', 'quicklinks', 'quote', 'date']));
  
    this.setState({
      items: JSON.parse(localStorage.getItem('order'))
    });

    toast(window.language.toasts.reset);
  }

  componentDidUpdate() {
    localStorage.setItem('order', JSON.stringify(this.state.items));
    window.stats.postEvent('setting', 'Widget order');
    EventBus.dispatch('refresh', 'widgets');
  }

  render() {
    return (
      <>
        <h2>{this.language.sections.order.title}</h2>
        <span className='modalLink' onClick={this.reset}>{this.language.buttons.reset}</span>
        <SortableContainer onSortEnd={this.onSortEnd} lockAxis='y' lockToContainerEdges disableAutoscroll>
          {this.state.items.map((value, index) => (
            <SortableItem key={`item-${value}`} index={index} value={value} />
          ))}
        </SortableContainer>
      </>
    );
  }
}
