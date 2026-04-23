import { useT } from 'contexts';

import { MdEdit, MdCancel, MdDragHandle } from 'react-icons/md';
import { Button } from 'components/Elements';
import { SmartIcon } from 'components/Elements/SmartIcon';

const QuickLink = ({
  item,
  deleteLink,
  startEditLink,
  draggable = false,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragOver = false,
  isDragging = false,
}) => {
  const t = useT();
  let target,
    rel = null;
  if (localStorage.getItem('quicklinksnewtab') === 'true') {
    target = '_blank';
    rel = 'noopener noreferrer';
  }

  const useText = localStorage.getItem('quicklinksText') === 'true';

  if (useText) {
    return (
      <a
        className="quicklinkstext"
        onContextMenu={(e) => deleteLink(item.key, e)}
        href={item.url}
        target={target}
        rel={rel}
        draggable={false}
      >
        {item.name}
      </a>
    );
  }

  const rootClass = `messageMap ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`;

  return (
    <div
      className={rootClass}
      draggable={draggable}
      onDragStart={(e) => onDragStart && onDragStart(e, item.key)}
      onDragOver={(e) => onDragOver && onDragOver(e, item.key)}
      onDrop={(e) => onDrop && onDrop(e, item.key)}
      onDragEnd={(e) => onDragEnd && onDragEnd(e)}
    >
      <div className="dragHandle" aria-hidden>
        <MdDragHandle />
      </div>

      <div className="icon">
        <SmartIcon item={item} size={30} />
      </div>
      <div className="messageText">
        <div className="title">{item.name}</div>
        <div className="subtitle">
          <a className="quicklinknostyle" target="_blank" rel="noopener noreferrer" href={item.url}>
            {item.url}
          </a>
        </div>
      </div>
      <div>
        <div className="messageAction">
          <Button
            type="settings"
            onClick={() => startEditLink(item)}
            icon={<MdEdit />}
            label={t('modals.main.settings.sections.quicklinks.edit')}
          />
          <Button
            type="settings"
            onClick={(e) => deleteLink(item.key, e)}
            icon={<MdCancel />}
            label={t('modals.main.marketplace.product.buttons.remove')}
          />
        </div>
      </div>
    </div>
  );
};

export { QuickLink as default, QuickLink };
