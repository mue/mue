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
import { SortableWidgetItem } from './SortableWidgetItem';

export const SortableWidgetList = ({ items, onDragEnd, startEditWidget, deleteWidget }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items.map((item) => item.key)} strategy={verticalListSortingStrategy}>
        <div className="widgets-list" role="list">
          {items.map((item) => (
            <SortableWidgetItem
              key={item.key}
              value={item}
              startEditWidget={startEditWidget}
              deleteWidget={deleteWidget}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
