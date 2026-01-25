import variables from 'config/variables';
import { memo, useState, useEffect } from 'react';
import { useT } from 'contexts';

import {
  MdChecklist,
  MdPushPin,
  MdDelete,
  MdPlaylistAdd,
  MdOutlineDragIndicator,
  MdPlaylistRemove,
  MdCheck,
} from 'react-icons/md';
import { Tooltip } from 'components/Elements';
import { Textarea } from 'components/Form/Settings';
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

const DragHandle = (props) => (
  <div className="todo-drag-handle" {...props}>
    <MdOutlineDragIndicator />
  </div>
);

const SortableItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style}>
      {typeof children === 'function' ? children({ attributes, listeners }) : children}
    </div>
  );
};

const SortableList = ({ items, onDragEnd, children }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div>{children}</div>
      </SortableContext>
    </DndContext>
  );
};

function Todo({ todoRef, floatRef, position, xPosition, yPosition }) {
  const t = useT();
  const [todo, setTodo] = useState(JSON.parse(localStorage.getItem('todo')) || []);
  const [showTodo, setShowTodo] = useState(localStorage.getItem('todoPinned') === 'true');
  const [zoomFontSize, setZoomFontSize] = useState('1.2rem');

  useEffect(() => {
    const handleRefresh = (data) => {
      if (data === 'navbar') {
        setZoomFontSize(Number(((localStorage.getItem('zoomNavbar') || 100) / 100) * 1.2) + 'rem');
      }
    };

    setZoomFontSize(Number(((localStorage.getItem('zoomNavbar') || 100) / 100) * 1.2) + 'rem');

    EventBus.on('refresh', handleRefresh);
    return () => {
      EventBus.off('refresh', handleRefresh);
    };
  }, []);

  const handleShowTodo = () => {
    setShowTodo(true);
  };

  const handleHideTodo = () => {
    setShowTodo(localStorage.getItem('todoPinned') === 'true');
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = Number(active.id);
      const newIndex = Number(over.id);

      setTodo((currentTodo) => {
        const newTodo = arrayMove(currentTodo, oldIndex, newIndex);
        localStorage.setItem('todo', JSON.stringify(newTodo));
        return newTodo;
      });
    }
  };

  /**
   * This function takes in an action, an index, and data, and then updates the todo list accordingly.
   * @param {String} action The action to perform. Can be 'add', 'remove', 'set', or 'done'.
   * @param {Number} index The index of the item to perform the action on.
   * @param {Object} data The data to use for the action.
   */
  const updateTodo = (action, index, data) => {
    setTodo((currentTodo) => {
      const newTodo = [...currentTodo];

      switch (action) {
        case 'add':
          newTodo.push({ value: '', done: false });
          break;
        case 'remove':
          newTodo.splice(index, 1);
          break;
        case 'set':
          newTodo[index] = { value: data.target.value, done: newTodo[index].done };
          break;
        case 'done':
          newTodo[index].done = !newTodo[index].done;
          break;
        default:
          break;
      }

      localStorage.setItem('todo', JSON.stringify(newTodo));
      return newTodo;
    });
  };

  const handlePin = () => {
    variables.stats.postEvent('feature', 'Todo pin');
    const todoPinned = localStorage.getItem('todoPinned') === 'true';
    localStorage.setItem('todoPinned', !todoPinned);
    setShowTodo(!todoPinned);
  };

  return (
    <div className="notes" onMouseLeave={handleHideTodo} onFocus={handleShowTodo}>
      <button
        className="navbarButton"
        onMouseEnter={handleShowTodo}
        onFocus={handleHideTodo}
        onBlur={handleShowTodo}
        ref={todoRef}
        style={{ fontSize: zoomFontSize }}
      >
        <MdChecklist className="topicons" />
      </button>
      {showTodo && (
        <span
          className="notesContainer"
          ref={floatRef}
          style={{
            position: position,
            top: yPosition ?? '44px',
            left: xPosition ?? '',
          }}
        >
          <div className="flexTodo">
            <div className="topBarNotes" style={{ display: 'flex' }}>
              <MdChecklist />
              <span>{t('widgets.navbar.todo.title')}</span>
            </div>
            <div className="notes-buttons">
              <Tooltip title={t('widgets.navbar.todo.pin')}>
                <button onClick={handlePin}>
                  <MdPushPin />
                </button>
              </Tooltip>
              <Tooltip title={t('widgets.navbar.todo.add')}>
                <button onClick={() => updateTodo('add')}>
                  <MdPlaylistAdd />
                </button>
              </Tooltip>
            </div>
            <div className={'todoRows'}>
              {todo.length === 0 ? (
                <div className="todosEmpty">
                  <div className="emptyNewMessage">
                    <MdPlaylistRemove />
                    <span className="title">
                      {t('widgets.navbar.todo.no_todos')}
                    </span>
                    <span className="subtitle">
                      {t('modals.main.settings.sections.message.add_some')}
                    </span>
                  </div>
                </div>
              ) : (
                <SortableList
                  items={todo.map((_, index) => index)}
                  onDragEnd={handleDragEnd}
                >
                  {todo.map((todoItem, index) => (
                    <SortableItem key={index} id={index}>
                      {({ attributes, listeners }) => (
                        <div className={'todoRow' + (todoItem.done ? ' done' : '')}>
                          <div
                            className={'todo-checkbox' + (todoItem.done ? ' checked' : '')}
                            onClick={() => updateTodo('done', index)}
                          >
                            {todoItem.done && <MdCheck />}
                          </div>
                          <Textarea
                            placeholder={t('widgets.navbar.notes.placeholder')}
                            value={todoItem.value}
                            onChange={(data) => updateTodo('set', index, data)}
                            readOnly={todoItem.done}
                            minRows={1}
                          />
                          <Tooltip
                            title={t(
                              'modals.main.marketplace.product.buttons.remove',
                            )}
                          >
                            <MdDelete onClick={() => updateTodo('remove', index)} />
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

function TodoWrapper() {
  const [reference, setReference] = useState(null);

  const { x, y, refs, strategy } = useFloating({
    placement: 'bottom',
    middleware: [shift()],
    elements: { reference },
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
