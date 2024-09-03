import variables from 'config/variables';
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

import { Tooltip } from 'components/Elements';

import Modal from 'react-modal';
import { ShareModal } from 'components/Elements';

import offline_quotes from './offline_quotes.json';

import EventBus from 'utils/eventbus';
import defaults from './options/default';

import './quote.scss';

class Quote extends PureComponent {
  buttons = {
    share: (
      <Tooltip title={variables.getMessage('widgets.quote.share')}>
        <button
          onClick={() => this.setState({ shareModal: true })}
          aria-label={variables.getMessage('widgets.quote.share')}
        >
          <MdIosShare className="copyButton" />
        </button>
      </Tooltip>
    ),
    copy: (
      <Tooltip title={variables.getMessage('widgets.quote.copy')}>
        <button
          onClick={() => this.copyQuote()}
          aria-label={variables.getMessage('widgets.quote.copy')}
        >
          <MdContentCopy className="copyButton" />
        </button>
      </Tooltip>
    ),
    unfavourited: (
      <Tooltip title={variables.getMessage('widgets.quote.favourite')}>
        <button
          onClick={() => this.favourite()}
          aria-label={variables.getMessage('widgets.quote.favourite')}
        >
          <MdStarBorder className="copyButton" />
        </button>
      </Tooltip>
    ),
    favourited: (
      <Tooltip title={variables.getMessage('widgets.quote.unfavourite')}>
        <button
          onClick={() => this.favourite()}
          aria-label={variables.getMessage('widgets.quote.unfavourite')}
        >
          <MdStar className="copyButton" />
        </button>
      </Tooltip>
    ),
  };

  constructor() {
    super();
    this.state = {
      quote: null,
      author: null,
      authorOccupation: null,
      favourited: this.useFavourite(),
      share: localStorage.getItem('quoteShareButton') === 'false' ? null : this.buttons.share,
      copy: localStorage.getItem('copyButton') === 'false' ? null : this.buttons.copy,
      quoteLanguage: '',
      type: localStorage.getItem('quoteType') || defaults.quoteType,
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
      : `https://${variables.locale_id.split('-')[0]}.wikipedia.org/wiki/${author
          .split(' ')
          .join('_')}`;
  }

  stripHTML(html) {
    const tmpdoc = new DOMParser().parseFromString(html, 'text/html');
    return tmpdoc.body.textContent || '';
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
        `https://${
          variables.locale_id.split('-')[0]
        }.wikipedia.org/w/api.php?action=query&titles=${author}&origin=*&prop=pageimages&format=json&pithumbsize=100`,
      )
    ).json();

    let authorimg, authorimglicense;
    const authorPage = authorimgdata.query.pages[Object.keys(authorimgdata.query.pages)[0]];
    try {
      authorimg = authorPage?.thumbnail?.source;

      const authorimglicensedata = await (
        await fetch(
          `https://${
            variables.locale_id.split('-')[0]
          }.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=extmetadata&titles=File:${
            authorPage.pageimage
          }&origin=*&format=json`,
        )
      ).json();

      const authorImagePage =
        authorimglicensedata.query.pages[Object.keys(authorimglicensedata.query.pages)[0]];
      const metadata = authorImagePage?.imageinfo?.[0]?.extmetadata;
      const license = metadata?.LicenseShortName;
      const photographer = this.stripHTML(
        metadata?.Attribution?.value || metadata?.Artist?.value || '',
      )
        .replace(/©\s/, '')
        .replace(/ \(talk\)/, ''); // talk page link (if applicable) is only removed for English

      if (!photographer) {
        authorimg = null;
        authorimglicense = null;
      } else if (license?.value === 'Public domain') {
        authorimglicense = null;
      } else {
        if (photographer) {
          authorimglicense = `© ${photographer}${license ? `. ${license.value}` : ''}`;
        } else if (license) {
          authorimglicense = license.value;
        }
        authorimglicense = authorimglicense.replace(/copyright\s/i, '');
      }
    } catch (e) {
      console.error(e);
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

        if (customQuote !== undefined && customQuote !== null) {
          return this.setState({
            quote: '"' + customQuote.quote + '"',
            author: customQuote.author,
            authorlink: this.getAuthorLink(customQuote.author),
            authorimg: await this.getAuthorImg(customQuote.author),
            noQuote: false,
          });
        } else {
          this.setState({
            noQuote: true,
          });
        }
        break;
      case 'quote_pack':
        if (offline) {
          return this.doOffline();
        }

        const quotePack = [];
        const installed = JSON.parse(localStorage.getItem('installed'));
        installed.forEach((item) => {
          if (item.type === 'quotes') {
            const quotes = item.quotes.map((quote) => ({
              ...quote,
              fallbackauthorimg: item.icon_url,
            }));
            quotePack.push(...quotes);
          }
        });

        if (quotePack) {
          const data = quotePack[Math.floor(Math.random() * quotePack.length)];
          return this.setState({
            quote: '"' + data.quote + '"',
            author: data.author,
            authorlink: this.getAuthorLink(data.author),
            authorimg: data.fallbackauthorimg,
          });
        } else {
          return this.doOffline();
        }
      case 'api':
        if (offline) {
          return this.doOffline();
        }

        const getAPIQuoteData = async () => {
          const quoteLanguage = localStorage.getItem('quoteLanguage') || 'en';
          const data = await (
            await fetch(`${variables.constants.API_URL}/quotes/random?language=${quoteLanguage}`)
          ).json();
          // If we hit the ratelimit, we fall back to local quotes
          if (data.statusCode === 429) {
            return null;
          }
          const authorimgdata = await this.getAuthorImg(data.author);
          return {
            quote: '"' + data.quote.replace(/\s+$/g, '') + '"',
            author: data.author,
            authorlink: this.getAuthorLink(data.author),
            authorimg: authorimgdata.authorimg,
            authorimglicense: authorimgdata.authorimglicense,
            quoteLanguage: quoteLanguage,
            authorOccupation: data.author_occupation,
          };
        };

        // First we try and get a quote from the API...
        try {
          let data = JSON.parse(localStorage.getItem('nextQuote')) || (await getAPIQuoteData());
          localStorage.setItem('nextQuote', null);
          if (data) {
            this.setState(data);
            localStorage.setItem('currentQuote', JSON.stringify(data));
            localStorage.setItem('nextQuote', JSON.stringify(await getAPIQuoteData())); // pre-fetch data about the next quote
          } else {
            this.doOffline();
          }
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
    variables.stats.postEvent('feature', 'quote', 'copied');
    navigator.clipboard.writeText(`${this.state.quote} - ${this.state.author}`);
    toast(variables.getMessage('toasts.quote'));
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

    variables.stats.postEvent('feature', 'quote', 'favourite');
  }

  init() {
    this.setZoom();

    const quoteType = localStorage.getItem('quoteType');

    if (
      this.state.type !== quoteType ||
      localStorage.getItem('quoteLanguage') !== this.state.quoteLanguage ||
      (quoteType === 'custom' && this.state.quote !== localStorage.getItem('customQuote')) ||
      (quoteType === 'custom' && this.state.author !== localStorage.getItem('customQuoteAuthor'))
    ) {
      this.getQuote();
    }
  }

  setZoom() {
    const zoomQuote = Number((localStorage.getItem('zoomQuote') || defaults.zoomQuote) / 100);
    this.quote.current.style.fontSize = `${0.8 * zoomQuote}em`;
    this.quoteauthor.current.style.fontSize = `${0.9 * zoomQuote}em`;
  }

  componentDidMount() {
    this.setZoom();

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

    if (
      localStorage.getItem('quotechange') === 'refresh' ||
      localStorage.getItem('quotechange') === null
    ) {
      this.setZoom();
      this.getQuote();
      localStorage.setItem('quoteStartTime', Date.now());
    }
  }

  componentWillUnmount() {
    EventBus.off('refresh');
  }

  render() {
    if (this.state.noQuote === true) {
      return <></>;
    }

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
                  aria-label="Learn about the author of the quote."
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
          <div className="author-holder">
            <div className="author">
              {localStorage.getItem('authorImg') !== 'false' ? (
                <div
                  className="author-img"
                  style={{ backgroundImage: `url(${this.state.authorimg})` }}
                >
                  {this.state.authorimg === undefined || this.state.authorimg ? '' : <MdPerson />}
                </div>
              ) : null}
              {this.state.author !== null ? (
                <div className="author-content" ref={this.quoteauthor}>
                  <span className="title">{this.state.author}</span>
                  {this.state.authorOccupation !== 'Unknown' && (
                    <span className="subtitle">{this.state.authorOccupation}</span>
                  )}
                  <span className="author-license" title={this.state.authorimglicense}>
                    {this.state.authorimglicense &&
                      this.state.authorimglicense.substring(0, 40) +
                        (this.state.authorimglicense.length > 40 ? '…' : '')}
                  </span>
                </div>
              ) : (
                <div className="author-content whileLoading" ref={this.quoteauthor}>
                  {/* these are placeholders for skeleton and as such don't need translating */}
                  <span className="title pulse">loading</span>
                  <span className="subtitle pulse">loading</span>
                </div>
              )}
              {(this.state.authorOccupation !== 'Unknown' && this.state.authorlink !== null) ||
              this.state.copy ||
              this.state.share ||
              this.state.favourited ? (
                <div className="quote-buttons">
                  {this.state.authorOccupation !== 'Unknown' && this.state.authorlink !== null ? (
                    <Tooltip title={variables.getMessage('widgets.quote.link_tooltip')}>
                      <a
                        href={this.state.authorlink}
                        className="quoteAuthorLink"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Learn about the author of the quote."
                      >
                        <MdOpenInNew />
                      </a>{' '}
                    </Tooltip>
                  ) : null}
                  {this.state.copy} {this.state.share} {this.state.favourited}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export { Quote as default, Quote };
