import variables from 'modules/variables';
import { PureComponent, memo } from 'react';
import PropTypes from 'prop-types';

import {
  MdChecklist,
  MdPushPin,
  MdDelete,
  MdPlaylistAdd,
  MdOutlineDragIndicator,
  MdPlaylistRemove,
} from 'react-icons/md';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Tooltip from 'components/helpers/tooltip/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import { shift, useFloating } from '@floating-ui/react-dom';
import { sortableContainer, sortableElement, sortableHandle } from '@muetab/react-sortable-hoc';
import EventBus from 'modules/helpers/eventbus';

const SortableItem = sortableElement(({ value }) => <div>{value}</div>);
const SortableContainer = sortableContainer(({ children }) => <div>{children}</div>);
const SortableHandle = sortableHandle(() => <MdOutlineDragIndicator />);

class Todo extends PureComponent {
  constructor() {
    super();
    this.state = {
      todo: JSON.parse(localStorage.getItem('todo')) || [],
      visibility: localStorage.getItem('todoPinned') === 'true' ? 'visible' : 'hidden',
      marginLeft: localStorage.getItem('refresh') === 'false' ? '-200px' : '-130px',
      showTodo: localStorage.getItem('todoPinned') === 'true',
    };
  }

  setZoom() {
    this.setState({
      zoomFontSize: Number(((localStorage.getItem('zoomNavbar') || 100) / 100) * 1.2) + 'rem',
    });
  }

  componentDidMount() {
    EventBus.on('refresh', (data) => {
      if (data === 'navbar') {
        this.forceUpdate();
        try {
          this.setZoom();
        } catch (e) {}
      }
    });

    this.setZoom();
  }

  componentWillUnmount() {
    EventBus.off('refresh');
  }

  /**
   * It takes an array, removes an item from it, and then inserts it at a new index.
   * @param {Array} array The array to move the item in.
   * @param {Number} oldIndex The index of the item to move.
   * @param {Number} newIndex The index to move the item to.
   * @returns The result of the splice method.
   */
  arrayMove(array, oldIndex, newIndex) {
    const result = Array.from(array);
    const [removed] = result.splice(oldIndex, 1);
    result.splice(newIndex, 0, removed);

    return result;
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      todo: this.arrayMove(this.state.todo, oldIndex, newIndex),
    });
  };

  showTodo() {
    this.setState({
      showTodo: true,
    });
  }

  hideTodo() {
    this.setState({
      showTodo: localStorage.getItem('todoPinned') === 'true',
    });
  }

  /**
   * This function takes in an action, an index, and data, and then updates the todo list accordingly.
   * @param {String} action The action to perform. Can be 'add', 'remove', 'set', or 'done'.
   * @param {Number} index The index of the item to perform the action on.
   * @param {Object} data The data to use for the action.
   */
  updateTodo(action, index, data) {
    let todo = this.state.todo;
    switch (action) {
      case 'add':
        todo.push({
          value: '',
          done: false,
        });
        break;
      case 'remove':
        todo.splice(index, 1);
        break;
      case 'set':
        todo[index] = {
          value: data.target.value,
          done: todo[index].done,
        };
        break;
      case 'done':
        todo[index].done = !todo[index].done;
        break;
      default:
        break;
    }

    localStorage.setItem('todo', JSON.stringify(todo));
    this.setState({
      todo,
    });
    this.forceUpdate();
  }

  pin() {
    variables.stats.postEvent('feature', 'Todo pin');
    const todoPinned = localStorage.getItem('todoPinned') === 'true';
    localStorage.setItem('todoPinned', !todoPinned);
    this.setState({
      showTodo: !todoPinned,
    });
  }

  render() {
    return (
      <div className="notes" onMouseLeave={() => this.hideTodo()} onFocus={() => this.showTodo()}>
        <button
          className="first"
          onMouseEnter={() => this.showTodo()}
          onFocus={() => this.hideTodo()}
          onBlur={() => this.showTodo()}
          ref={this.props.todoRef}
          style={{ fontSize: this.state.zoomFontSize }}
        >
          <MdChecklist className="topicons" />
        </button>
        {this.state.showTodo && (
          <span
            className="notesContainer"
            ref={this.props.floatRef}
            style={{
              position: this.props.position,
              top: this.props.yPosition ?? '44px',
              left: this.props.xPosition ?? '',
            }}
          >
            <div className="flexTodo">
              <div className="topBarNotes" style={{ display: 'flex' }}>
                <MdChecklist />
                <span>{variables.getMessage('widgets.navbar.todo.title')}</span>
              </div>
              <div className="notes-buttons">
                <Tooltip title={variables.getMessage('widgets.navbar.todo.pin')}>
                  <button onClick={() => this.pin()}>
                    <MdPushPin />
                  </button>
                </Tooltip>
                <Tooltip title={variables.getMessage('widgets.navbar.todo.add')}>
                  <button onClick={() => this.updateTodo('add')}>
                    <MdPlaylistAdd />
                  </button>
                </Tooltip>
              </div>
              <div className={'todoRows'}>
                {this.state.todo.length === 0 ? (
                  <div className="todosEmpty">
                    <div className="emptyNewMessage">
                      <MdPlaylistRemove />
                      <span className="title">
                        {variables.getMessage('widgets.navbar.todo.no_todos')}
                      </span>
                      <span className="subtitle">
                        {variables.getMessage('modals.main.settings.sections.message.add_some')}
                      </span>
                    </div>
                  </div>
                ) : (
                  <SortableContainer
                    onSortEnd={this.onSortEnd}
                    lockAxis="y"
                    lockToContainerEdges
                    disableAutoscroll
                    useDragHandle
                  >
                    {this.state.todo.map((_value, index) => (
                      <SortableItem
                        key={`item-${index}`}
                        index={index}
                        value={
                          <div
                            className={'todoRow' + (this.state.todo[index].done ? ' done' : '')}
                            key={index}
                          >
                            <Checkbox
                              checked={this.state.todo[index].done}
                              onClick={() => this.updateTodo('done', index)}
                            />
                            <TextareaAutosize
                              placeholder={variables.getMessage('widgets.navbar.notes.placeholder')}
                              value={this.state.todo[index].value}
                              onChange={(data) => this.updateTodo('set', index, data)}
                              readOnly={this.state.todo[index].done}
                            />
                            <MdDelete onClick={() => this.updateTodo('remove', index)} />
                            <SortableHandle />
                          </div>
                        }
                      />
                    ))}
                  </SortableContainer>
                )}
              </div>
            </div>
          </span>
        )}
      </div>
    );
  }
}

function TodoWrapper() {
  const { x, y, reference, floating, strategy } = useFloating({
    placement: 'bottom',
    middleware: [shift()],
  });

  return (
    <Todo todoRef={reference} floatRef={floating} position={strategy} xPosition={x} yPosition={y} />
  );
}

Todo.propTypes = {
  todoRef: PropTypes.object,
  floatRef: PropTypes.object,
  position: PropTypes.string,
  xPosition: PropTypes.string,
  yPosition: PropTypes.string,
};

export default memo(TodoWrapper);
