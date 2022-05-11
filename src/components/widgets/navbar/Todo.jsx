import variables from 'modules/variables';
import { PureComponent } from 'react';
import {
  MdChecklist,
  MdPushPin,
  MdDelete,
  MdPlaylistAdd,
  MdOutlineDragIndicator,
} from 'react-icons/md';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Tooltip from '../../helpers/tooltip/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import { shift, useFloating } from '@floating-ui/react-dom';
//import Hotkeys from 'react-hot-keys';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';

const SortableItem = sortableElement(({ value }) => <div>{value}</div>);

const SortableContainer = sortableContainer(({ children }) => <div>{children}</div>);

class Todo extends PureComponent {
  constructor() {
    super();
    this.state = {
      todo: JSON.parse(localStorage.getItem('todoContent')) || [
        {
          value: '',
          done: false,
        },
      ],
      visibility: localStorage.getItem('todoPinned') === 'true' ? 'visible' : 'hidden',
      marginLeft: localStorage.getItem('refresh') === 'false' ? '-200px' : '-130px',
      showTodo: localStorage.getItem('todoPinned') === 'true',
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
      todo: this.arrayMove(this.state.todo, oldIndex, newIndex),
    });
  };

  showTodo() {
    this.setState({
      showTodo: true,
    });
  }

  hideTodo() {
    if (localStorage.getItem('todoPinned') === 'true') {
      this.setState({
        showTodo: true,
      });
    } else {
      this.setState({
        showTodo: false,
      });
    }
  }

  updateTodo(action, index, data) {
    let todoContent = this.state.todo;
    switch (action) {
      case 'add':
        todoContent.push({
          value: '',
          done: false,
        });
        break;
      case 'remove':
        todoContent.splice(index, 1);
        if (todoContent.length === 0) {
          todoContent.push({
            value: '',
            done: false,
          });
        }
        break;
      case 'set':
        todoContent[index] = {
          value: data.target.value,
          done: todoContent[index].done,
        };
        break;
      case 'done':
        todoContent[index].done = !todoContent[index].done;
        break;
      default:
        break;
    }

    localStorage.setItem('todoContent', JSON.stringify(todoContent));
    this.setState({
      todo: todoContent,
    });
    this.forceUpdate();
  }

  pin() {
    variables.stats.postEvent('feature', 'Todo pin');
    if (localStorage.getItem('todoPinned') === 'true') {
      localStorage.setItem('todoPinned', false);
      this.setState({
        showTodo: false,
      });
    } else {
      localStorage.setItem('todoPinned', true);
      this.setState({
        showTodo: true,
      });
    }
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
                <span>Todo</span>
              </div>
              <div className="notes-buttons">
                <Tooltip title="Pin">
                  <button onClick={() => this.pin()}>
                    <MdPushPin />
                  </button>
                </Tooltip>
                <Tooltip title={'Add'}>
                  <button onClick={() => this.updateTodo('add')}>
                    <MdPlaylistAdd />
                  </button>
                </Tooltip>
              </div>
              <div className={'todoRows'}>
                <SortableContainer
                  onSortEnd={this.onSortEnd}
                  lockAxis="y"
                  lockToContainerEdges
                  disableAutoscroll
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
                            placeholder={variables.language.getMessage(
                              variables.languagecode,
                              'widgets.navbar.notes.placeholder',
                            )}
                            value={this.state.todo[index].value}
                            onChange={(data) => this.updateTodo('set', index, data)}
                            readOnly={this.state.todo[index].done}
                          />
                          <MdDelete onClick={() => this.updateTodo('remove', index)} />
                          <MdOutlineDragIndicator />
                        </div>
                      }
                    />
                  ))}
                </SortableContainer>
              </div>
            </div>
          </span>
        )}
      </div>
    );
  }
}

export default function TodoWrapper() {
  const { x, y, reference, floating, strategy } = useFloating({
    placement: 'bottom',
    middleware: [shift()],
  });

  return (
    <Todo todoRef={reference} floatRef={floating} position={strategy} xPosition={x} yPosition={y} />
  );
}
