import React from 'react';

import DragHandleIcon from '@material-ui/icons/DragIndicator';

import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import { toast } from 'react-toastify';

const SortableItem = sortableElement(({value}) => (
  <li className='sortableitem'>
    <DragHandleIcon style={{'verticalAlign': 'middle'}} />
    {value.charAt(0).toUpperCase() + value.slice(1)}
  </li>
));
  
const SortableContainer = sortableContainer(({children}) => {
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

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState(({items}) => ({
      items: this.arrayMove(items, oldIndex, newIndex)
    }));
  }

  reset = () => {
    localStorage.setItem('order', JSON.stringify(['greeting', 'time', 'quicklinks', 'quote', 'date']));
  
    this.setState({
      items: JSON.parse(localStorage.getItem('order'))
    });

    toast(this.language.toasts.reset);
  }

  componentDidUpdate() {
    localStorage.setItem('order', JSON.stringify(this.state.items));
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
