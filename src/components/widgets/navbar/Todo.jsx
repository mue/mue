import variables from 'modules/variables';
import { PureComponent, memo } from 'react';
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
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import EventBus from 'modules/helpers/eventbus';

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

  setZoom() {
    this.setState({
      zoomFontSize: Number(((localStorage.getItem('zoomNavbar') || 100) / 100) * 1.2) + "rem"
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
      showTodo: (localStorage.getItem('todoPinned') === 'true'),
    });
  }

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
        if (todo.length === 0) {
          todo.push({
            value: '',
            done: false,
          });
        }
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
    const todoPinned = (localStorage.getItem('todoPinned') === 'true');
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
                            placeholder={variables.getMessage('widgets.navbar.notes.placeholder')}
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

function TodoWrapper() {
  const { x, y, reference, floating, strategy } = useFloating({
    placement: 'bottom',
    middleware: [shift()],
  });

  return (
    <Todo todoRef={reference} floatRef={floating} position={strategy} xPosition={x} yPosition={y} />
  );
}

export default memo(TodoWrapper);