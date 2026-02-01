import { memo, useRef, useState, useEffect, useCallback } from 'react';
import { Tooltip } from 'components/Elements';
import { SmartIcon } from 'components/Elements/SmartIcon';

import EventBus from 'utils/eventbus';
import { readQuicklinks, readConfig, readGroups } from 'utils/quicklinks';

import './quicklinks.scss';

const QuickLinks = memo(() => {
  const [items, setItems] = useState(readQuicklinks());
  const [groups, setGroups] = useState(readGroups());
  const [config, setConfig] = useState(readConfig());
  const [forceUpdate, setForceUpdate] = useState(0);
  const quicklinksContainer = useRef(null);

  // widget zoom
  const setZoom = useCallback((element) => {
    if (!element) return;

    const zoom = localStorage.getItem('zoomQuicklinks') || 100;
    const style = localStorage.getItem('quickLinksStyle') || 'card';

    for (const link of element.getElementsByTagName('span')) {
      link.style.fontSize = `${14 * Number(zoom / 100)}px`;
    }

    if (style !== 'text_only') {
      for (const img of element.getElementsByTagName('img')) {
        img.style.height = `${30 * Number(zoom / 100)}px`;
      }
    }
  }, []);

  useEffect(() => {
    const handleRefresh = (data) => {
      if (data === 'quicklinks') {
        const enabled = localStorage.getItem('quicklinksenabled');

        if (enabled === 'false') {
          if (quicklinksContainer.current) {
            quicklinksContainer.current.style.display = 'none';
          }
          return;
        }

        if (quicklinksContainer.current) {
          const layoutMode = readConfig().layoutMode || 'flex';
          quicklinksContainer.current.style.display = layoutMode === 'grid' ? 'grid' : 'flex';
          const newItems = readQuicklinks();
          const newGroups = readGroups();
          const newConfig = readConfig();
          setItems(newItems);
          setGroups(newGroups);
          setConfig(newConfig);
          setForceUpdate(Date.now());
        }
      }
    };

    EventBus.on('refresh', handleRefresh);

    if (quicklinksContainer.current) {
      setZoom(quicklinksContainer.current);
    }

    return () => {
      EventBus.off('refresh', handleRefresh);
    };
  }, [setZoom]);

  useEffect(() => {
    setZoom(quicklinksContainer.current);
  }, [items, forceUpdate, setZoom]);

  let target,
    rel = null;
  if (localStorage.getItem('quicklinksnewtab') === 'true') {
    target = '_blank';
    rel = 'noopener noreferrer';
  }

  const tooltipEnabled = localStorage.getItem('quicklinkstooltip');

  const quickLink = (item, index) => {
    const zoom = localStorage.getItem('zoomQuicklinks') || 100;
    const iconSize = 30 * Number(zoom / 100);
    const style = localStorage.getItem('quickLinksStyle') || 'card';

    if (style === 'text_only') {
      return (
        <a
          className="quicklinkstext"
          key={`quicklink-${item.key}-${index}`}
          href={item.url}
          target={target}
          rel={rel}
          draggable={false}
        >
          {item.name}
        </a>
      );
    }

    if (style === 'metro') {
      return (
        <a
          className="quickLinksMetro"
          key={`quicklink-${item.key}-${index}`}
          href={item.url}
          target={target}
          rel={rel}
          draggable={false}
        >
          <SmartIcon item={item} size={iconSize} />
          <span className="subtitle">{item.name}</span>
        </a>
      );
    }

    if (style === 'card') {
      return (
        <a
          className="quickLinksCard"
          key={`quicklink-${item.key}-${index}`}
          href={item.url}
          target={target}
          rel={rel}
          draggable={false}
        >
          <div className="card-icon-container">
            <SmartIcon item={item} size={iconSize} />
          </div>
          <span className="card-label">{item.name}</span>
        </a>
      );
    }

    // Default icon style
    const link = (
      <a
        key={`quicklink-${item.key}-${index}`}
        href={item.url}
        target={target}
        rel={rel}
        draggable={false}
      >
        <SmartIcon item={item} size={iconSize} />
      </a>
    );

    return tooltipEnabled === 'true' ? (
      <Tooltip title={item.name} placement="bottom" key={`quicklink-${item.key}-${index}`}>
        {link}
      </Tooltip>
    ) : (
      link
    );
  };

  const layoutMode = config.layoutMode || 'flex';
  const gridColumns = config.gridColumns || 'auto';
  const gridRows = config.gridRows || 'auto';
  const groupingEnabled = config.groupingEnabled || false;

  const containerClasses = `quicklinkscontainer layout-${layoutMode} cols-${gridColumns} rows-${gridRows}`;

  const renderGroupedItems = () => {
    const ungroupedItems = items.filter((item) => !item.groupId);
    const groupedByGroup = {};

    items.forEach((item) => {
      if (item.groupId) {
        if (!groupedByGroup[item.groupId]) {
          groupedByGroup[item.groupId] = [];
        }
        groupedByGroup[item.groupId].push(item);
      }
    });

    return (
      <>
        {ungroupedItems.map((item, index) => quickLink(item, index))}
        {groups.map((group) => {
          const groupItems = groupedByGroup[group.key] || [];
          if (groupItems.length === 0) return null;

          return (
            <div key={group.key} className="quicklinks-group">
              {config.showGroupHeaders && (
                <div className="group-header">
                  {group.icon && <span className="group-icon">{group.icon}</span>}
                  <span className="group-name">{group.name}</span>
                  <span className="group-count">{groupItems.length}</span>
                </div>
              )}
              <div className="group-items">
                {groupItems.map((item, index) => quickLink(item, `${group.key}-${index}`))}
              </div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className={containerClasses} ref={quicklinksContainer}>
      {groupingEnabled
        ? renderGroupedItems()
        : items && items.map((item, index) => quickLink(item, index))}
    </div>
  );
});

QuickLinks.displayName = 'QuickLinks';

export { QuickLinks as default, QuickLinks };
