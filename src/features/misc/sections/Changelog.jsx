import variables from 'config/variables';
import { PureComponent, createRef } from 'react';
import Markdown from 'markdown-to-jsx';
import { MdOutlineWifiOff } from 'react-icons/md';

class Changelog extends PureComponent {
  constructor() {
    super();
    this.state = {
      title: null,
    };
    this.offlineMode = localStorage.getItem('offlineMode') === 'true';
    this.controller = new AbortController();
    this.changelog = createRef();
  }

  parseMarkdown = (text) => {
    if (typeof text !== 'string') {
      throw new Error('Input must be a string');
    }

    // Replace markdown syntax
    text = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^## (.*$)/gm, '<span class="title">$1</span>')
      .replace(
        /((http|https):\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>',
      )
      // resolve @ to github user link
      .replace(
        /@([a-zA-Z0-9-_]+)/g,
        '<a href="https://github.com/$1" target="_blank" class="changelogAt">@$1</a>',
      );

    // Replace list items
    text = text.replace(/^\* (.*$)/gm, '<li>$1</li>');

    // Wrap list items in <ul></ul>
    text = text.replace(/((<li>.*<\/li>\s*)+)/g, '<ul>$1</ul>');

    return text;
  };

  async getUpdate() {
    const releases = await fetch(
      `https://api.github.com/repos/${variables.constants.ORG_NAME}/${variables.constants.REPO_NAME}/releases`,
      {
        signal: this.controller.signal,
      },
    );

    if (this.controller.signal.aborted === true) {
      return;
    }

    // get the release which tag_name is the same as the current version
    const data = await releases.json();
    let release = data.find((release) => release.tag_name === variables.constants.VERSION);

    if (!release) {
      release = data[0];
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
      content: changelog.body,
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
      <article className="changelogtab prose dark:prose-invert" ref={this.changelog}>
        <div className="not-prose">
          <span className="mainTitle">{this.state.title}</span>
          <span className="subtitle">Released on {this.state.date}</span>
        </div>
        <Markdown options={{ overrides: { a: { props: { target: '_blank' } } } }}>
          {this.state.content}
        </Markdown>
      </article>
    );
  }
}

export { Changelog as default, Changelog };
