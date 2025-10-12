import { PureComponent, createRef } from 'react';
import { Tooltip } from 'components/Elements';

import EventBus from 'utils/eventbus';

import './quicklinks.scss';

// Safe read to avoid crashing when localStorage has bad data
const readQuicklinks = () => {
  try {
    const raw = localStorage.getItem('quicklinks');
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn('Failed to parse quicklinks from localStorage. Resetting to []', e);
    return [];
  }
};

class QuickLinks extends PureComponent {
  constructor() {
    super();
    this.state = {
      items: readQuicklinks(),
      forceUpdate: 0, // Used to force complete re-render
    };
    this.quicklinksContainer = createRef();
  }

  // widget zoom
  setZoom(element) {
    if (!element) return;
    
    const zoom = localStorage.getItem('zoomQuicklinks') || 100;
    for (const link of element.getElementsByTagName('span')) {
      link.style.fontSize = `${14 * Number(zoom / 100)}px`;
    }

    if (localStorage.getItem('quickLinksStyle') !== 'text') {
      for (const img of element.getElementsByTagName('img')) {
        img.style.height = `${30 * Number(zoom / 100)}px`;
      }
    }
  }

  componentDidMount() {
    EventBus.on('refresh', (data) => {
      if (data === 'quicklinks') {
        if (localStorage.getItem('quicklinksenabled') === 'false') {
          return (this.quicklinksContainer.current.style.display = 'none');
        }

        this.quicklinksContainer.current.style.display = 'flex';
        
        this.setState({
          items: readQuicklinks(),
          forceUpdate: Date.now(),
        }, () => {
          this.setZoom(this.quicklinksContainer.current);
        });
      }
    });

    this.setZoom(this.quicklinksContainer.current);
  }

  componentWillUnmount() {
    EventBus.off('refresh');
  }

  render() {
    let target,
      rel = null;
    if (localStorage.getItem('quicklinksnewtab') === 'true') {
      target = '_blank';
      rel = 'noopener noreferrer';
    }

    const tooltipEnabled = localStorage.getItem('quicklinkstooltip');

    const quickLink = (item, index) => {
      if (localStorage.getItem('quickLinksStyle') === 'text') {
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

      const img =
        item.icon ||
        'https://icon.horse/icon/' + item.url.replace('https://', '').replace('http://', '');

      if (localStorage.getItem('quickLinksStyle') === 'metro') {
        return (
          <a
            className="quickLinksMetro"
            key={`quicklink-${item.key}-${index}`}
            href={item.url}
            target={target}
            rel={rel}
            draggable={false}
          >
            <img src={img} alt={item.name} draggable={false} />
            <span className="subtitle">{item.name}</span>
          </a>
        );
      }

      const link = (
        <a key={`quicklink-${item.key}-${index}`} href={item.url} target={target} rel={rel} draggable={false}>
          <img src={img} alt={item.name} draggable={false} />
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

    return (
      <div 
        className="quicklinkscontainer" 
        ref={this.quicklinksContainer}
      >
        {this.state.items && this.state.items.map((item, index) => quickLink(item, index))}
      </div>
    );
  }
}

export { QuickLinks as default, QuickLinks };