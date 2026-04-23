import { MdEdit, MdDelete, MdWidgets } from 'react-icons/md';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useT } from 'contexts/TranslationContext';
import { DragHandle } from './DragHandle';

export const SortableWidgetItem = ({ value, startEditWidget, deleteWidget }) => {
  const t = useT();

  const getPositionLabel = (position) => {
    const positionKey = position?.replace('-', '_');
    const translationKey = `modals.main.settings.sections.advanced.custom_widget.positions.${positionKey}`;
    return (
      t(translationKey) ||
      t('modals.main.settings.sections.advanced.custom_widget.positions.top_right')
    );
  };
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
        <div className="widget-name">
          {value.name} {value.id ? `(#${value.id})` : ''}
        </div>
        <div className="widget-url">{value.url}</div>
        <div className="widget-position">
          {getPositionLabel(value.position)}
          {value.renderAbove ? ` • ${t('common.above_widgets')}` : ''}
        </div>
      </div>
      <div className="widget-actions">
        <button
          className="widget-action-btn"
          onClick={(e) => {
            e.stopPropagation();
            startEditWidget(value);
          }}
          title={t('common.actions.edit')}
        >
          <MdEdit />
          <span>{t('common.actions.edit')}</span>
        </button>
        <button
          className="widget-action-btn widget-remove-btn"
          onClick={(e) => {
            e.stopPropagation();
            deleteWidget(value.key, e);
          }}
          title={t('common.actions.remove')}
        >
          <MdDelete />
          <span>{t('common.actions.remove')}</span>
        </button>
      </div>
    </div>
  );
};
