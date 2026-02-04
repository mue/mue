import { MdEdit, MdDelete } from 'react-icons/md';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useT } from 'contexts/TranslationContext';
import { DragHandle } from './DragHandle';
import { SmartIcon } from 'components/Elements/SmartIcon';

export const SortableItem = ({ value, enabled, startEditLink, deleteLink }) => {
  const t = useT();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: value.key,
    disabled: !enabled,
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
      className={`quicklink-item ${!enabled ? 'disabled' : ''}`}
      role="listitem"
    >
      <DragHandle />
      <div className="quicklink-icon">
        <SmartIcon item={value} size={32} />
      </div>
      <div className="quicklink-content">
        <div className="quicklink-name">{value.name}</div>
        <div className="quicklink-url">{value.url}</div>
      </div>
      <div className="quicklink-actions">
        <button
          className="quicklink-action-btn"
          onClick={(e) => {
            if (!enabled) {
              return;
            }
            e.stopPropagation();
            startEditLink(value);
          }}
          title={t('common.actions.edit')}
          disabled={!enabled}
          aria-disabled={!enabled}
        >
          <MdEdit />
          <span>{t('common.actions.edit')}</span>
        </button>
        <button
          className="quicklink-action-btn quicklink-remove-btn"
          onClick={(e) => {
            if (!enabled) return;
            e.stopPropagation();
            deleteLink(value.key, e);
          }}
          title={t('common.actions.remove')}
          disabled={!enabled}
          aria-disabled={!enabled}
        >
          <MdDelete />
          <span>{t('common.actions.remove')}</span>
        </button>
      </div>
    </div>
  );
};
