import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

export const SortableList = ({ items, enabled, onDragEnd, startEditLink, deleteLink }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items.map((item) => item.key)} strategy={verticalListSortingStrategy}>
        <div className="quicklinks-list" role="list">
          {items.map((item) => (
            <SortableItem
              key={item.key}
              value={item}
              enabled={enabled}
              startEditLink={startEditLink}
              deleteLink={deleteLink}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
