import { PureComponent, createRef } from 'react';
import Tooltip from 'components/helpers/tooltip/Tooltip';
import EventBus from 'modules/helpers/eventbus';

import './quicklinks.scss';

export default class QuickLinks extends PureComponent {
  constructor() {
    super();
    this.state = {
      items: JSON.parse(localStorage.getItem('quicklinks')),
    };
    this.quicklinksContainer = createRef();
  }

  // widget zoom
  setZoom(element) {
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

        this.quicklinksContainer.current.style.display = 'block';
        this.setZoom(this.quicklinksContainer.current);

        this.setState({
          items: JSON.parse(localStorage.getItem('quicklinks')),
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

    const quickLink = (item) => {
      if (localStorage.getItem('quickLinksStyle') === 'text') {
        return (
          <a
            className="quicklinkstext"
            key={item.key}
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
        'https://icon.horse/icon/ ' + item.url.replace('https://', '').replace('http://', '');

      if (localStorage.getItem('quickLinksStyle') === 'metro') {
        return (
          <a
            className="quickLinksMetro"
            key={item.key}
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
        <a key={item.key} href={item.url} target={target} rel={rel} draggable={false}>
          <img src={img} alt={item.name} draggable={false} />
        </a>
      );

      return tooltipEnabled === 'true' ? (
        <Tooltip title={item.name} placement="bottom" key={item.key}>
          {link}
        </Tooltip>
      ) : (
        link
      );
    };

    return (
      <div className="quicklinkscontainer" ref={this.quicklinksContainer}>
        {this.state.items.map((item) => quickLink(item))}
      </div>
    );
  }
}
