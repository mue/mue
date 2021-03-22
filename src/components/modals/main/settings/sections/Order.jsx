import React from 'react';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import DragHandleIcon from '@material-ui/icons/DragIndicator';

const SortableItem = sortableElement(({value}) => (
  <li className='sortableitem'>
    <DragHandleIcon/>
    {value.charAt(0).toUpperCase() + value.slice(1)}
  </li>
));
  
const SortableContainer = sortableContainer(({children}) => {
  return <ul className='sortablecontainer'>{children}</ul>;
});

export default class OrderSettings extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      items: JSON.parse(localStorage.getItem('order'))
    };
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState(({items}) => ({
      items: arrayMove(items, oldIndex, newIndex)
    }));
  };

  componentDidUpdate() {
    localStorage.setItem('order', JSON.stringify(this.state.items));
  }

  render() {
    return (
      <>
        <h2>Order</h2>
        <SortableContainer onSortEnd={this.onSortEnd}>
          {this.state.items.map((value, index) => (
            <SortableItem key={`item-${value}`} index={index} value={value} />
          ))}
        </SortableContainer>
      </>
    );
  }
}
