import variables from 'modules/variables';
import { PureComponent } from 'react';
import { MdOutlineDragIndicator } from 'react-icons/md';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import { toast } from 'react-toastify';

import EventBus from 'modules/helpers/eventbus';

const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);
const widget_name = {
  greeting: getMessage('modals.main.settings.sections.greeting.title'),
  time: getMessage('modals.main.settings.sections.time.title'),
  quicklinks: getMessage('modals.main.settings.sections.quicklinks.title'),
  quote: getMessage('modals.main.settings.sections.quote.title'),
  date: getMessage('modals.main.settings.sections.date.title'),
  message: getMessage('modals.main.settings.sections.message.title'),
  reminder: 'reminder',
};

const SortableItem = sortableElement(({ value }) => (
  <li className="sortableItem">
    {widget_name[value]}
    <MdOutlineDragIndicator />
  </li>
));

const SortableContainer = sortableContainer(({ children }) => (
  <ul className="sortablecontainer">{children}</ul>
));

export default class OrderSettings extends PureComponent {
  constructor() {
    super();
    this.state = {
      items: JSON.parse(localStorage.getItem('order')),
    };
  }

  arrayMove(array, oldIndex, newIndex) {
    const result = Array.from(array);
    const [removed] = result.splice(oldIndex, 1);
    result.splice(newIndex, 0, removed);

    return result;
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      items: this.arrayMove(this.state.items, oldIndex, newIndex),
    });
  };

  reset = () => {
    localStorage.setItem(
      'order',
      JSON.stringify(['greeting', 'time', 'quicklinks', 'quote', 'date', 'message', 'reminder']),
    );

    this.setState({
      items: JSON.parse(localStorage.getItem('order')),
    });

    toast(getMessage('toasts.reset'));
  };

  enabled = (setting) => {
    switch (setting) {
      case 'quicklinks':
        return localStorage.getItem('quicklinksenabled') === 'true';
      default:
        return localStorage.getItem(setting) === 'true';
    }
  };

  componentDidUpdate() {
    localStorage.setItem('order', JSON.stringify(this.state.items));
    variables.stats.postEvent('setting', 'Widget order');
    EventBus.dispatch('refresh', 'widgets');
  }

  render() {
    return (
      <>
        <span className="mainTitle">{getMessage('modals.main.settings.sections.order.title')}</span>
        <span className="link" onClick={this.reset}>
          {getMessage('modals.main.settings.buttons.reset')}
        </span>
        <SortableContainer
          onSortEnd={this.onSortEnd}
          lockAxis="y"
          lockToContainerEdges
          disableAutoscroll
        >
          {this.state.items.map((value, index) => {
            if (!this.enabled(value)) {
              return null;
            }

            return <SortableItem key={`item-${value}`} index={index} value={value} />;
          })}
        </SortableContainer>
      </>
    );
  }
}
