import variables from 'modules/variables';
import { PureComponent, createRef } from 'react';
import {
  MdContentCopy,
  MdStarBorder,
  MdStar,
  MdPerson,
  MdOpenInNew,
  MdIosShare,
} from 'react-icons/md';

import { toast } from 'react-toastify';
//import Hotkeys from 'react-hot-keys';

import Tooltip from '../../helpers/tooltip/Tooltip';
import Modal from 'react-modal';
import ShareModal from '../../helpers/sharemodal/ShareModal';

import offline_quotes from './offline_quotes.json';

import Interval from 'modules/helpers/interval';
import EventBus from 'modules/helpers/eventbus';

import './quote.scss';

const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

export default class Quote extends PureComponent {
  buttons = {
    share: (
      <Tooltip title={getMessage('widgets.quote.share')}>
        <button onClick={() => this.setState({ shareModal: true })}>
          <MdIosShare className="copyButton" />
        </button>
      </Tooltip>
    ),
    copy: (
      <Tooltip title={getMessage('widgets.quote.copy')}>
        <button onClick={() => this.copyQuote()}>
          <MdContentCopy className="copyButton" />
        </button>
      </Tooltip>
    ),
    unfavourited: (
      <Tooltip title={getMessage('widgets.quote.favourite')}>
        <button onClick={() => this.favourite()}>
          <MdStarBorder className="copyButton" />
        </button>
      </Tooltip>
    ),
    favourited: (
      <Tooltip title={getMessage('widgets.quote.unfavourite')}>
        <button onClick={() => this.favourite()}>
          <MdStar className="copyButton" />
        </button>
      </Tooltip>
    ),
  };

  constructor() {
    super();
    this.state = {
      quote: '',
      author: '',
      authorOccupation: '',
      favourited: this.useFavourite(),
      share: localStorage.getItem('quoteShareButton') === 'false' ? null : this.buttons.share,
      copy: localStorage.getItem('copyButton') === 'false' ? null : this.buttons.copy,
      quoteLanguage: '',
      type: localStorage.getItem('quoteType') || 'api',
      shareModal: false,
    };
    this.quote = createRef();
    this.quotediv = createRef();
    this.quoteauthor = createRef();
  }

  useFavourite() {
    if (localStorage.getItem('favouriteQuoteEnabled') === 'true') {
      return localStorage.getItem('favouriteQuote')
        ? this.buttons.favourited
        : this.buttons.unfavourited;
    } else {
      return null;
    }
  }

  doOffline() {
    // Get a random quote from our local JSON
    const quote = offline_quotes[Math.floor(Math.random() * offline_quotes.length)];

    this.setState({
      quote: '"' + quote.quote + '"',
      author: quote.author,
      authorlink: this.getAuthorLink(quote.author),
      authorimg: '',
    });
  }

  getAuthorLink(author) {
    return localStorage.getItem('authorLink') === 'false' || author === 'Unknown'
      ? null
      : `https://${variables.languagecode.split('_')[0]}.wikipedia.org/wiki/${author
          .split(' ')
          .join('_')}`;
  }

  async getAuthorImg(author) {
    if (localStorage.getItem('authorImg') === 'false') {
      return {
        authorimg: null,
        authorimglicense: null,
      };
    }

    const authorimgdata = await (
      await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&titles=${author}&origin=*&prop=pageimages&format=json&pithumbsize=100`,
      )
    ).json();

    let authorimg, authorimglicense;
    try {
      authorimg =
        authorimgdata.query.pages[Object.keys(authorimgdata.query.pages)[0]].thumbnail.source;

      const authorimglicensedata = await (
        await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=extmetadata&titles=File:${
            authorimgdata.query.pages[Object.keys(authorimgdata.query.pages)[0]].pageimage
          }&origin=*&format=json`,
        )
      ).json();

      const license =
        authorimglicensedata.query.pages[Object.keys(authorimglicensedata.query.pages)[0]]
          .imageinfo[0].extmetadata.LicenseShortName;
      const photographer =
        authorimglicensedata.query.pages[Object.keys(authorimglicensedata.query.pages)[0]]
          .imageinfo[0].extmetadata.Attribution || 'Unknown';
      authorimglicense = `© ${photographer.value}. ${license.value}`;

      if (license.value === 'Public domain') {
        authorimglicense = null;
      } else if (photographer.value === 'Unknown' || !photographer) {
        authorimglicense = null;
        authorimg = null;
      }
    } catch (e) {
      authorimg = null;
      authorimglicense = null;
    }

    if (author === 'Unknown') {
      authorimg = null;
      authorimglicense = null;
    }

    return {
      authorimg,
      authorimglicense,
    };
  }

  async getQuote() {
    const offline = localStorage.getItem('offlineMode') === 'true';

    const favouriteQuote = localStorage.getItem('favouriteQuote');
    if (favouriteQuote) {
      let author = favouriteQuote.split(' - ')[1];
      const authorimgdata = await this.getAuthorImg(author);
      return this.setState({
        quote: favouriteQuote.split(' - ')[0],
        author,
        authorlink: this.getAuthorLink(author),
        authorimg: authorimgdata.authorimg,
        authorimglicense: authorimgdata.authorimglicense,
      });
    }

    switch (this.state.type) {
      case 'custom':
        let customQuote;
        try {
          customQuote = JSON.parse(localStorage.getItem('customQuote'));
        } catch (e) {
          // move to new format
          customQuote = [
            {
              quote: localStorage.getItem('customQuote'),
              author: localStorage.getItem('customQuoteAuthor'),
            },
          ];
          localStorage.setItem('customQuote', JSON.stringify(customQuote));
        }

        // pick random
        customQuote = customQuote
          ? customQuote[Math.floor(Math.random() * customQuote.length)]
          : null;

        if (
          customQuote &&
          customQuote !== '' &&
          customQuote !== 'undefined' &&
          customQuote !== ['']
        ) {
          return this.setState({
            quote: '"' + customQuote.quote + '"',
            author: customQuote.author,
            authorlink: this.getAuthorLink(customQuote.author),
            authorimg: await this.getAuthorImg(customQuote.author),
          });
        }
        break;
      case 'quote_pack':
        if (offline) {
          return this.doOffline();
        }

        const quotePackAPI = JSON.parse(localStorage.getItem('quoteAPI'));
        if (quotePackAPI) {
          try {
            const data = await (await fetch(quotePackAPI.url)).json();
            const author = data[quotePackAPI.author] || quotePackAPI.author;
            const installed = JSON.parse(localStorage.getItem('installed'));
            // todo: make this actually get the correct quote pack, instead of the first available
            const info = installed.find((i) => i.type === 'quotes');

            return this.setState({
              quote: '"' + data[quotePackAPI.quote] + '"',
              author,
              authorimg: info.icon_url,
            });
          } catch (e) {
            return this.doOffline();
          }
        }

        let quotePack = localStorage.getItem('quote_packs');

        if (quotePack !== null) {
          quotePack = JSON.parse(quotePack);

          if (quotePack) {
            const data = quotePack[Math.floor(Math.random() * quotePack.length)];
            const installed = JSON.parse(localStorage.getItem('installed'));
            // todo: make this actually get the correct quote pack, instead of the first available
            const info = installed.find((i) => i.type === 'quotes');

            return this.setState({
              quote: '"' + data.quote + '"',
              author: data.author,
              authorlink: this.getAuthorLink(data.author),
              authorimg: info.icon_url,
            });
          } else {
            return this.doOffline();
          }
        }
        break;
      case 'api':
        if (offline) {
          return this.doOffline();
        }

        // First we try and get a quote from the API...
        try {
          const quotelanguage = localStorage.getItem('quotelanguage');
          const data = await (
            await fetch(variables.constants.API_URL + '/quotes/random?language=' + quotelanguage)
          ).json();

          // If we hit the ratelimit, we fall back to local quotes
          if (data.statusCode === 429) {
            return this.doOffline();
          }

          const authorimgdata = await this.getAuthorImg(data.author);

          const object = {
            quote: '"' + data.quote + '"',
            author: data.author,
            authorlink: this.getAuthorLink(data.author),
            authorimg: authorimgdata.authorimg,
            authorimglicense: authorimgdata.authorimglicense,
            quoteLanguage: quotelanguage,
            authorOccupation: data.author_occupation,
          };

          this.setState(object);
          localStorage.setItem('currentQuote', JSON.stringify(object));
        } catch (e) {
          // ...and if that fails we load one locally
          this.doOffline();
        }
        break;
      default:
        break;
    }
  }

  copyQuote() {
    variables.stats.postEvent('feature', 'Quote copied');
    navigator.clipboard.writeText(`${this.state.quote} - ${this.state.author}`);
    toast(getMessage('toasts.quote'));
  }

  tweetQuote() {
    variables.stats.postEvent('feature', 'Quote tweet');
    window
      .open(
        `https://twitter.com/intent/tweet?text=${this.state.quote} - ${this.state.author} on @getmue`,
        '_blank',
      )
      .focus();
  }

  favourite() {
    if (localStorage.getItem('favouriteQuote')) {
      localStorage.removeItem('favouriteQuote');
      this.setState({
        favourited: this.buttons.unfavourited,
      });
    } else {
      localStorage.setItem('favouriteQuote', this.state.quote + ' - ' + this.state.author);
      this.setState({
        favourited: this.buttons.favourited,
      });
    }

    variables.stats.postEvent('feature', 'Quote favourite');
  }

  init() {
    this.setZoom();

    const quoteType = localStorage.getItem('quoteType');

    if (
      this.state.type !== quoteType ||
      localStorage.getItem('quotelanguage') !== this.state.quoteLanguage ||
      (quoteType === 'custom' && this.state.quote !== localStorage.getItem('customQuote')) ||
      (quoteType === 'custom' && this.state.author !== localStorage.getItem('customQuoteAuthor'))
    ) {
      this.getQuote();
    }
  }

  setZoom() {
    const zoomQuote = Number((localStorage.getItem('zoomQuote') || 100) / 100);
    this.quote.current.style.fontSize = `${0.8 * zoomQuote}em`;
    this.quoteauthor.current.style.fontSize = `${0.9 * zoomQuote}em`;
  }

  componentDidMount() {
    EventBus.on('refresh', (data) => {
      if (data === 'quote') {
        if (localStorage.getItem('quote') === 'false') {
          return (this.quotediv.current.style.display = 'none');
        }

        this.quotediv.current.style.display = 'block';
        this.init();

        // buttons hot reload
        this.setState({
          favourited: this.useFavourite(),
          share: localStorage.getItem('quoteShareButton') === 'false' ? null : this.buttons.share,
          copy: localStorage.getItem('copyButton') === 'false' ? null : this.buttons.copy,
        });
      }

      // uninstall quote pack reverts the quote to what you had previously
      if (data === 'marketplacequoteuninstall') {
        this.init();
      }

      if (data === 'quoterefresh') {
        this.getQuote();
      }
    });

    const interval = localStorage.getItem('quotechange');
    if (interval && interval !== 'refresh' && localStorage.getItem('quoteType') === 'api') {
      Interval(
        () => {
          this.setZoom();
          this.getQuote();
        },
        Number(interval),
        'quote',
      );

      try {
        this.setState(JSON.parse(localStorage.getItem('currentQuote')));
      } catch (e) {
        this.setZoom();
        this.getQuote();
      }
    } else {
      // don't bother with the checks if we're loading for the first time
      this.setZoom();
      this.getQuote();
    }
  }

  componentWillUnmount() {
    EventBus.off('refresh');
  }

  render() {
    return (
      <div className="quotediv" ref={this.quotediv}>
        <Modal
          closeTimeoutMS={300}
          isOpen={this.state.shareModal}
          className="Modal mainModal"
          overlayClassName="Overlay"
          ariaHideApp={false}
          onRequestClose={() => this.setState({ shareModal: false })}
        >
          <ShareModal
            data={`${this.state.quote} - ${this.state.author}`}
            modalClose={() => this.setState({ shareModal: false })}
          />
        </Modal>
        <span className="quote" ref={this.quote}>
          {this.state.quote}
        </span>
        {localStorage.getItem('widgetStyle') === 'legacy' ? (
          <>
            <div>
              <h1 className="quoteauthor" ref={this.quoteauthor}>
                <a
                  href={this.state.authorlink}
                  className="quoteAuthorLink"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {this.state.author}
                </a>
              </h1>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              {this.state.copy} {this.state.share} {this.state.favourited}
            </div>
          </>
        ) : (
          <>
            <div className="author-holder">
              <div className="author">
                <div
                  className="author-img"
                  style={{ backgroundImage: `url(${this.state.authorimg})` }}
                >
                  {this.state.authorimg === undefined || this.state.authorimg ? '' : <MdPerson />}
                </div>
                {this.state.author !== '' ? (
                  <div className="author-content" ref={this.quoteauthor}>
                    <span className="title">{this.state.author}</span>
                    {this.state.authorOccupation !== 'Unknown' ? (
                      <span className="subtitle">{this.state.authorOccupation}</span>
                    ) : null}
                    <span className="author-license">{this.state.authorimglicense ? this.state.authorimglicense.replace(' undefined. ', ' ') : null}</span>
                  </div>
                ) : (
                  <div className="author-content whileLoading" ref={this.quoteauthor}>
                    {/* these are placeholders for skeleton and as such don't need translating */}
                    <span className="title">loading</span>
                    <span className="subtitle">loading</span>
                  </div>
                )}
                <div className="quote-buttons">
                  {this.state.authorOccupation !== 'Unknown' && this.state.authorlink !== '' ? (
                    <Tooltip title={getMessage('widgets.quote.link_tooltip')}>
                      <a
                        href={this.state.authorlink}
                        className="quoteAuthorLink"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MdOpenInNew />
                      </a>{' '}
                    </Tooltip>
                  ) : null}
                  {this.state.copy} {this.state.share} {this.state.favourited}
                </div>
              </div>
            </div>
          </>
        )}
        {/*variables.keybinds.favouriteQuote && variables.keybinds.favouriteQuote !== '' ? <Hotkeys keyName={variables.keybinds.favouriteQuote} onKeyDown={() => this.favourite()} /> : null*/}
        {/*variables.keybinds.tweetQuote && variables.keybinds.tweetQuote !== '' ? <Hotkeys keyName={variables.keybinds.tweetQuote} onKeyDown={() => this.tweetQuote()} /> : null*/}
        {/*variables.keybinds.copyQuote && variables.keybinds.copyQuote !== '' ? <Hotkeys keyName={variables.keybinds.copyQuote} onKeyDown={() => this.copyQuote()} /> : null*/}
      </div>
    );
  }
}
