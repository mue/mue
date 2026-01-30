import { MdEdit, MdDelete, MdWidgets } from 'react-icons/md';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DragHandle } from './DragHandle';

export const SortableWidgetItem = ({ value, startEditWidget, deleteWidget }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: value.key,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="widget-item"
      role="listitem"
    >
      <DragHandle />
      <div className="widget-icon">
        <MdWidgets />
      </div>
      <div className="widget-content">
        <div className="widget-name">{value.name} {value.id ? `(#${value.id})` : ''}</div>
        <div className="widget-url">{value.url}</div>
        <div className="widget-position">
          {value.position ? value.position.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Top Right'}
          {value.renderAbove ? ' • Above widgets' : ''}
        </div>
      </div>
      <div className="widget-actions">
        <button
          className="widget-action-btn"
          onClick={(e) => {
            e.stopPropagation();
            startEditWidget(value);
          }}
          title="Edit"
        >
          <MdEdit />
          <span>Edit</span>
        </button>
        <button
          className="widget-action-btn widget-remove-btn"
          onClick={(e) => {
            e.stopPropagation();
            deleteWidget(value.key, e);
          }}
          title="Remove"
        >
          <MdDelete />
          <span>Remove</span>
        </button>
      </div>
    </div>
  );
};
