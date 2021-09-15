import variables from 'modules/variables';
import { PureComponent } from 'react';
import { DragIndicator } from '@mui/icons-material';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import { toast } from 'react-toastify';

import EventBus from 'modules/helpers/eventbus';

const getMessage = (languagecode, text) => variables.language.getMessage(languagecode, text);
const languagecode = variables.languagecode;
const widget_name = {
  greeting: getMessage(languagecode, 'modals.main.settings.sections.greeting.title'),
  time: getMessage(languagecode, 'modals.main.settings.sections.time.title'),
  quicklinks: getMessage(languagecode, 'modals.main.settings.sections.quicklinks.title'),
  quote: getMessage(languagecode, 'modals.main.settings.sections.quote.title'),
  date: getMessage(languagecode, 'modals.main.settings.sections.greeting.title'),
  message: getMessage(languagecode, 'modals.main.settings.sections.message.title')
};

const SortableItem = sortableElement(({ value }) => (
  <li className='sortableitem'>
    <DragIndicator style={{ verticalAlign: 'middle' }} />
    {widget_name[value]}
  </li>
));
  
const SortableContainer = sortableContainer(({ children }) => {
  return <ul className='sortablecontainer'>{children}</ul>;
});

export default class OrderSettings extends PureComponent {
  constructor() {
    super();
    this.state = {
      items: JSON.parse(localStorage.getItem('order'))
    };
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
    localStorage.setItem('order', JSON.stringify(['greeting', 'time', 'quicklinks', 'quote', 'date', 'message']));
  
    this.setState({
      items: JSON.parse(localStorage.getItem('order'))
    });

    toast(getMessage(languagecode, 'toats.reset'));
  }

  enabled = (setting) => {
    switch (setting) {
      case 'quicklinks':
        return (localStorage.getItem('quicklinksenabled') === 'true');
      default:
        return (localStorage.getItem(setting) === 'true');
    }
  }

  componentDidUpdate() {
    localStorage.setItem('order', JSON.stringify(this.state.items));
    window.stats.postEvent('setting', 'Widget order');
    EventBus.dispatch('refresh', 'widgets');
  }

  render() {
    return (
      <>
        <h2>{getMessage(languagecode, 'modals.main.settings.sections.order.title')}</h2>
        <span className='modalLink' onClick={this.reset}>{getMessage(languagecode, 'modals.main.settings.buttons.reset')}</span>
        <SortableContainer onSortEnd={this.onSortEnd} lockAxis='y' lockToContainerEdges disableAutoscroll>
          {this.state.items.map((value, index) => {
            if (!this.enabled(value)) { 
              return null;
            }

            return (
              <SortableItem key={`item-${value}`} index={index} value={value} />
            );
          })}
        </SortableContainer>
      </>
    );
  }
}
