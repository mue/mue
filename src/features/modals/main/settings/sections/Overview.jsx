import variables from 'modules/variables';
import { PureComponent } from 'react';
import { MdOutlineDragIndicator } from 'react-icons/md';
import { sortableContainer, sortableElement } from '@muetab/react-sortable-hoc';
import { toast } from 'react-toastify';

import Greeting from './overview_skeletons/Greeting';
import Clock from './overview_skeletons/Clock';
import Quote from './overview_skeletons/Quote';
import QuickLinks from './overview_skeletons/QuickLinks';
import Date from './overview_skeletons/Date';
import Message from './overview_skeletons/Message';

import EventBus from 'modules/helpers/eventbus';

const widget_name = {
  greeting: variables.getMessage('modals.main.settings.sections.greeting.title'),
  time: variables.getMessage('modals.main.settings.sections.time.title'),
  quicklinks: variables.getMessage('modals.main.settings.sections.quicklinks.title'),
  quote: variables.getMessage('modals.main.settings.sections.quote.title'),
  date: variables.getMessage('modals.main.settings.sections.date.title'),
  message: variables.getMessage('modals.main.settings.sections.message.title'),
};

const SortableItem = sortableElement(({ value }) => (
  <li className="sortableItem">
    {widget_name[value]}
    <MdOutlineDragIndicator />
  </li>
));

const SortableContainer = sortableContainer(({ children }) => (
  <ul className="sortablecontainer">{children}</ul>
));

export default class OrderSettings extends PureComponent {
  constructor() {
    super();
    this.state = {
      items: JSON.parse(localStorage.getItem('order')),
      news: {
        title: '',
        date: '',
        description: '',
        link: '',
        linkText: '',
      },
      newsDone: false,
    };
  }

  arrayMove(array, oldIndex, newIndex) {
    const result = Array.from(array);
    const [removed] = result.splice(oldIndex, 1);
    result.splice(newIndex, 0, removed);

    return result;
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      items: this.arrayMove(this.state.items, oldIndex, newIndex),
    });
  };

  reset = () => {
    localStorage.setItem(
      'order',
      JSON.stringify(['greeting', 'time', 'quicklinks', 'quote', 'date', 'message']),
    );

    this.setState({
      items: JSON.parse(localStorage.getItem('order')),
    });

    toast(variables.getMessage('toasts.reset'));
  };

  enabled = (setting) => {
    switch (setting) {
      case 'quicklinks':
        return localStorage.getItem('quicklinksenabled') === 'true';
      default:
        return localStorage.getItem(setting) === 'true';
    }
  };

  getTab = (value) => {
    switch (value) {
      case 'greeting':
        return <Greeting />;
      case 'time':
        return <Clock />;
      case 'quicklinks':
        return <QuickLinks />;
      case 'quote':
        return <Quote />;
      case 'date':
        return <Date />;
      case 'message':
        return <Message />;
      default:
        return null;
    }
  };

  async getNews() {
    const data = await (await fetch(variables.constants.API_URL + '/news')).json();
    data.date = new window.Date(data.date).toLocaleDateString(
      variables.languagecode.replace('_', '-'),
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
    );

    this.setState({
      news: data,
      newsDone: true,
    });
  }

  componentDidUpdate() {
    localStorage.setItem('order', JSON.stringify(this.state.items));
    variables.stats.postEvent('setting', 'Widget order');
    EventBus.emit('refresh', 'widgets');
  }

  componentDidMount() {
    this.getNews();
  }

  render() {
    return (
      <>
        <span className="mainTitle">
          {variables.getMessage('modals.main.marketplace.product.overview')}
        </span>
        {/*<span className="title">{variables.getMessage('modals.main.marketplace.product.overview')}</span>
        <span className="link" onClick={this.reset}>
          {variables.getMessage('modals.main.settings.buttons.reset')}
    </span>*/}
        <div className="overviewGrid">
          <div>
            <span className="title">{variables.getMessage('modals.welcome.buttons.preview')}</span>
            <div className="tabPreview">
              <div className="previewItem" style={{ maxWidth: '50%' }}>
                {this.state.items.map((value, index) => {
                  if (!this.enabled(value)) {
                    return null;
                  }

                  return (
                    <div className="previewItem" key={`item-${value}`} index={index}>
                      {' '}
                      {this.getTab(value)}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="overviewNews">
              <span className="title">{this.state.news.title}</span>
              <span className="subtitle">{this.state.news.date}</span>
              <span className="content">{this.state.news.description}</span>
              <a className="link" href={this.state.news.link}>
                {this.state.news.linkText}
              </a>
            </div>
          </div>
          <div>
            <span className="title">
              {variables.getMessage('modals.main.settings.sections.order.title')}
            </span>
            <SortableContainer
              onSortEnd={this.onSortEnd}
              lockAxis="y"
              lockToContainerEdges
              disableAutoscroll
            >
              {this.state.items.map((value, index) => {
                if (!this.enabled(value)) {
                  return null;
                }

                return <SortableItem key={`item-${value}`} index={index} value={value} />;
              })}
            </SortableContainer>
          </div>
        </div>
      </>
    );
  }
}
