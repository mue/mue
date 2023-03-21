import variables from 'modules/variables';
import { PureComponent, createRef } from 'react';
import { MdOutlineWifiOff } from 'react-icons/md';
import Modal from 'react-modal';

import Lightbox from '../../marketplace/Lightbox';

export default class Changelog extends PureComponent {
  constructor() {
    super();
    this.state = {
      title: null,
      showLightbox: false,
      lightboxImg: null,
    };
    this.offlineMode = localStorage.getItem('offlineMode') === 'true';
    this.controller = new AbortController();
    this.changelog = createRef();
  }

  async getUpdate() {
    const res = await fetch(variables.constants.BLOG_POST + '/index.json', {
      signal: this.controller.signal,
    });

    if (res.status === 404) {
      this.setState({ error: true });
      return;
    }

    if (this.controller.signal.aborted === true) {
      return;
    }

    const data = await res.json();
    let date = new Date(data.date.split(' ')[0]);
    date = date.toLocaleDateString(variables.languagecode.replace('_', '-'), {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    this.setState({
      title: data.title,
      date,
      image: data.featured_image || null,
      author: variables.getMessage('modals.main.settings.sections.changelog.by', {
        author: data.authors.join(', '),
      }),
      content: data.markdown,
    });

    // lightbox etc
    const images = this.changelog.current.getElementsByTagName('img');
    const links = this.changelog.current.getElementsByTagName('a');

    for (const img of images) {
      img.draggable = false;
      img.onclick = () => {
        this.setState({
          showLightbox: true,
          lightboxImg: img.src,
        });
      };
    }

    // open in new tab
    for (let link = 0; link < links.length; link++) {
      links[link].target = '_blank';
      links[link].rel = 'noopener noreferrer';
    }
  }

  componentDidMount() {
    if (navigator.onLine === false || this.offlineMode) {
      return;
    }

    this.getUpdate();
  }

  componentWillUnmount() {
    // stop making requests
    this.controller.abort();
  }

  render() {
    const errorMessage = (msg) => {
      return (
        <div className="emptyItems">
          <div className="emptyMessage">{msg}</div>
        </div>
      );
    };

    if (navigator.onLine === false || this.offlineMode) {
      return errorMessage(
        <>
          <MdOutlineWifiOff />
          <h1>{variables.getMessage('modals.main.marketplace.offline.title')}</h1>
          <p className="description">
            {variables.getMessage('modals.main.marketplace.offline.description')}
          </p>
        </>,
      );
    }

    if (this.state.error === true) {
      return errorMessage(
        <>
          <MdOutlineWifiOff />
          <span className="title">{variables.getMessage('modals.main.error_boundary.title')}</span>
          <span className="subtitle">
            {variables.getMessage('modals.main.error_boundary.message')}
          </span>
        </>,
      );
    }

    if (!this.state.title) {
      return errorMessage(
        <div className="loaderHolder">
          <div id="loader"></div>
          <span className="subtitle">{variables.getMessage('modals.main.loading')}</span>
        </div>,
      );
    }

    return (
      <div className="changelogtab" ref={this.changelog}>
        <h1>{this.state.title}</h1>
        <h5>
          {this.state.author} • {this.state.date}
        </h5>
        {this.state.image ? (
          <img
            draggable={false}
            src={this.state.image}
            alt={this.state.title}
            className="updateImage"
          />
        ) : null}
        <div className="updateChangelog">{this.state.content}</div>
        <Modal
          closeTimeoutMS={100}
          onRequestClose={() => this.setState({ showLightbox: false })}
          isOpen={this.state.showLightbox}
          className="Modal lightBoxModal"
          overlayClassName="Overlay resetoverlay"
          ariaHideApp={false}
        >
          <Lightbox
            modalClose={() => this.setState({ showLightbox: false })}
            img={this.state.lightboxImg}
          />
        </Modal>
      </div>
    );
  }
}
