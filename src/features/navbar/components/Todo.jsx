import variables from 'config/variables';
import { PureComponent, memo, useState } from 'react';

import {
  MdChecklist,
  MdPushPin,
  MdDelete,
  MdPlaylistAdd,
  MdOutlineDragIndicator,
  MdPlaylistRemove,
} from 'react-icons/md';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { Tooltip } from 'components/Elements';

import Checkbox from '@mui/material/Checkbox';
import { shift, useFloating } from '@floating-ui/react-dom';
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
import EventBus from 'utils/eventbus';

const DragHandle = () => (
  <div className="todo-drag-handle" {...arguments[0]}>
    <MdOutlineDragIndicator />
  </div>
);

const SortableItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {typeof children === 'function' ? children({ attributes, listeners }) : children}
    </div>
  );
};

const SortableList = ({ items, onDragEnd, children }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div>{children}</div>
      </SortableContext>
    </DndContext>
  );
};

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

  handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = Number(active.id);
      const newIndex = Number(over.id);

      this.setState({
        todo: arrayMove(this.state.todo, oldIndex, newIndex),
      });
    }
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
          className="navbarButton"
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
                  <SortableList
                    items={this.state.todo.map((_, index) => index)}
                    onDragEnd={this.handleDragEnd}
                  >
                    {this.state.todo.map((todo, index) => (
                      <SortableItem key={index} id={index}>
                        {({ attributes, listeners }) => (
                          <div
                            className={'todoRow' + (todo.done ? ' done' : '')}
                          >
                            <Checkbox
                              checked={todo.done}
                              onClick={() => this.updateTodo('done', index)}
                            />
                            <TextareaAutosize
                              placeholder={variables.getMessage('widgets.navbar.notes.placeholder')}
                              value={todo.value}
                              onChange={(data) => this.updateTodo('set', index, data)}
                              readOnly={todo.done}
                            />
                            <Tooltip
                              title={variables.getMessage(
                                'modals.main.marketplace.product.buttons.remove',
                              )}
                            >
                              <MdDelete onClick={() => this.updateTodo('remove', index)} />
                            </Tooltip>
                            <DragHandle {...attributes} {...listeners} />
                          </div>
                        )}
                      </SortableItem>
                    ))}
                  </SortableList>
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
  const [reference, setReference] = useState(null);

  const { x, y, refs, strategy } = useFloating({
    placement: 'bottom',
    middleware: [shift()],
    elements: {
      reference,
    },
  });

  return (
    <Todo
      todoRef={setReference}
      floatRef={refs.setFloating}
      position={strategy}
      xPosition={x}
      yPosition={y}
    />
  );
}

const MemoizedTodoWrapper = memo(TodoWrapper);
export { MemoizedTodoWrapper as default, MemoizedTodoWrapper as Todo };
