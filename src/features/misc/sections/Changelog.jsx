import variables from 'config/variables';
import { PureComponent, createRef } from 'react';
import { MdOutlineWifiOff } from 'react-icons/md';
import Modal from 'react-modal';

import Lightbox from '../../marketplace/components/Elements/Lightbox/Lightbox';

class Changelog extends PureComponent {
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

  parseMarkdown = (text) => {
    text = text.replace(/^\* /gm, '<li>').replace(/\n/g, '</li>');
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/^## (.*$)/gm, '<h3>$1</h3>');
    text = text.replace(
      /((http|https):\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>',
    );

    return text;
  };

  async getUpdate() {
    const releases = await fetch(
      `https://api.github.com/repos/${variables.constants.ORG_NAME}/${variables.constants.REPO_NAME}/releases`,
      {
        signal: this.controller.signal,
      },
    );

    // get the release which tag_name is the same as the current version
    const data = await releases.json();
    const release = data.find((release) => release.tag_name === `7.0.0`);

    if (this.controller.signal.aborted === true) {
      return;
    }

    // request the changelog
    const res = await fetch(release.url, { signal: this.controller.signal });

    if (res.status === 404) {
      this.setState({ error: true });
      return;
    }

    if (this.controller.signal.aborted === true) {
      return;
    }

    const changelog = await res.json();
    this.setState({
      title: changelog.name,
      content: this.parseMarkdown(changelog.body),
      date: new Date(changelog.published_at).toLocaleDateString(),
    });
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
        <h5>Released on {this.state.date}</h5>
        {this.state.image && (
          <img
            draggable={false}
            src={this.state.image}
            alt={this.state.title}
            className="updateImage"
          />
        )}
        <div className="updateChangelog" dangerouslySetInnerHTML={{ __html: this.state.content }} />
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

export { Changelog as default, Changelog };
