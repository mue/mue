import { useState, useEffect, useRef } from 'react';
import variables from 'config/variables';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { ShareModal } from 'components/Elements';

import Stats from 'features/stats/api/stats';
import EventBus from 'utils/eventbus';
import defaults from './options/default';
import offline_quotes from './offline_quotes.json';

import QuoteButtons from './components/QuoteButtons';
import QuoteAuthor from './components/QuoteAuthor';

import './quote.scss';

const Quote = () => {
  const [quoteState, setQuoteState] = useState({
    quote: null,
    author: null,
    authorOccupation: null,
    authorLink: null,
    authorImg: null,
    authorImgLicense: null,
    quoteLanguage: '',
    type: localStorage.getItem('quoteType') || defaults.quoteType,
    shareModal: false,
    isFavourited: !!localStorage.getItem('favouriteQuote'),
    noQuote: false,
  });

  const quoteRef = useRef();
  const quoteDivRef = useRef();
  const quoteAuthorRef = useRef();

  const stripHTML = (html) => {
    const tmpdoc = new DOMParser().parseFromString(html, 'text/html');
    return tmpdoc.body.textContent || '';
  };

  const getAuthorLink = (author) => {
    return localStorage.getItem('authorLink') === 'false' || author === 'Unknown'
      ? null
      : `https://${variables.locale_id.split('-')[0]}.wikipedia.org/wiki/${author
          .split(' ')
          .join('_')}`;
  };

  const getAuthorImg = async (author) => {
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
      const photographer = stripHTML(metadata?.Attribution?.value || metadata?.Artist?.value || '')
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
  };

  const copyQuote = () => {
    Stats.postEvent('feature', 'quote', 'copied');
    navigator.clipboard.writeText(`${quoteState.quote} - ${quoteState.author}`);
    toast(variables.getMessage('toasts.quote'));
  };

  const handleFavourite = () => {
    const newIsFavourited = !quoteState.isFavourited;
    if (newIsFavourited) {
      localStorage.setItem('favouriteQuote', quoteState.quote + ' - ' + quoteState.author);
      Stats.postEvent('feature', 'quote', 'favourited');
    } else {
      localStorage.removeItem('favouriteQuote');
      Stats.postEvent('feature', 'quote', 'favourite_removed');
    }
    setQuoteState((prev) => ({ ...prev, isFavourited: newIsFavourited }));
  };

  const setZoom = () => {
    const zoomQuote = Number((localStorage.getItem('zoomQuote') || defaults.zoomQuote) / 100);
    if (quoteRef.current && quoteAuthorRef.current) {
      quoteRef.current.style.fontSize = `${0.8 * zoomQuote}em`;
      quoteAuthorRef.current.style.fontSize = `${0.9 * zoomQuote}em`;
    }
  };

  const doOffline = () => {
    // Get a random quote from our local JSON
    const quote = offline_quotes[Math.floor(Math.random() * offline_quotes.length)];

    setQuoteState({
      quote: '"' + quote.quote + '"',
      author: quote.author,
      authorLink: getAuthorLink(quote.author),
      authorImg: '',
    });
    Stats.postEvent('feature', 'quote', 'shown');
  };

  const getQuote = async () => {
    const offline = localStorage.getItem('offlineMode') === 'true';

    const favouriteQuote = localStorage.getItem('favouriteQuote');
    if (favouriteQuote) {
      let author = favouriteQuote.split(' - ')[1];
      const authorimgdata = await getAuthorImg(author);
      setQuoteState({
        quote: favouriteQuote.split(' - ')[0],
        author,
        authorLink: getAuthorLink(author),
        authorImg: authorimgdata.authorimg,
        authorImgLicense: authorimgdata.authorimglicense,
      });
      Stats.postEvent('feature', 'quote', 'shown');
      return;
    }

    switch (quoteState.type) {
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
          setQuoteState({
            quote: '"' + customQuote.quote + '"',
            author: customQuote.author,
            authorLink: getAuthorLink(customQuote.author),
            authorImg: await getAuthorImg(customQuote.author),
            noQuote: false,
          });
          Stats.postEvent('feature', 'quote', 'shown');
        } else {
          setQuoteState({
            noQuote: true,
          });
        }
        break;
      case 'quote_pack':
        if (offline) {
          doOffline();
          return;
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
          setQuoteState({
            quote: '"' + data.quote + '"',
            author: data.author,
            authorLink: getAuthorLink(data.author),
            authorImg: data.fallbackauthorimg,
          });
          Stats.postEvent('feature', 'quote', 'shown');
        } else {
          doOffline();
        }
        break;
      case 'api':
        if (offline) {
          doOffline();
          return;
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
          const authorimgdata = await getAuthorImg(data.author);
          return {
            quote: '"' + data.quote.replace(/\s+$/g, '') + '"',
            author: data.author,
            authorLink: getAuthorLink(data.author),
            authorImg: authorimgdata.authorimg,
            authorImgLicense: authorimgdata.authorimglicense,
            quoteLanguage: quoteLanguage,
            authorOccupation: data.author_occupation,
          };
        };

        // First we try and get a quote from the API...
        try {
          let data = JSON.parse(localStorage.getItem('nextQuote')) || (await getAPIQuoteData());
          localStorage.setItem('nextQuote', null);
          if (data) {
            setQuoteState(data);
            localStorage.setItem('currentQuote', JSON.stringify(data));
            localStorage.setItem('nextQuote', JSON.stringify(await getAPIQuoteData())); // pre-fetch data about the next quote
            Stats.postEvent('feature', 'quote', 'shown');
          } else {
            doOffline();
          }
        } catch (e) {
          // ...and if that fails we load one locally
          doOffline();
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // Initialize quote
    getQuote();
    setZoom();

    // Event listener setup
    const handleRefresh = (data) => {
      if (data === 'quote') {
        if (localStorage.getItem('quote') === 'false') {
          quoteDivRef.current.style.display = 'none';
          return;
        }

        quoteDivRef.current.style.display = 'block';
        getQuote();
        setZoom();
      }

      if (data === 'marketplacequoteuninstall') {
        getQuote();
      }

      if (data === 'quoterefresh') {
        getQuote();
      }
    };

    EventBus.on('refresh', handleRefresh);
    return () => EventBus.off('refresh', handleRefresh);
  }, []);

  if (quoteState.noQuote) {
    return null;
  }

  return (
    <div className="quotediv" ref={quoteDivRef}>
      <Modal
        closeTimeoutMS={300}
        isOpen={quoteState.shareModal}
        className="Modal mainModal"
        overlayClassName="Overlay"
        ariaHideApp={false}
        onRequestClose={() => setQuoteState((prev) => ({ ...prev, shareModal: false }))}
      >
        <ShareModal
          data={`${quoteState.quote} - ${quoteState.author}`}
          modalClose={() => setQuoteState((prev) => ({ ...prev, shareModal: false }))}
        />
      </Modal>

      <span className="quote w-[40vw]" ref={quoteRef}>
        {quoteState.quote}
      </span>

      {localStorage.getItem('widgetStyle') === 'legacy' ? (
        <>
          <div>
            <h1 className="quoteauthor" ref={quoteAuthorRef}>
              <a
                href={quoteState.authorLink}
                className="quoteAuthorLink"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Learn about the author of the quote."
              >
                {quoteState.author}
              </a>
            </h1>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <QuoteButtons
              onCopy={copyQuote}
              onFavourite={handleFavourite}
              onShare={() => setQuoteState((prev) => ({ ...prev, shareModal: true }))}
              isFavourited={quoteState.isFavourited}
            />
          </div>
        </>
      ) : (
        <div className="author-holder" ref={quoteAuthorRef}>
          <QuoteAuthor
            author={quoteState.author}
            authorOccupation={quoteState.authorOccupation}
            authorImg={quoteState.authorImg}
            authorImgLicense={quoteState.authorImgLicense}
            authorLink={quoteState.authorLink}
            buttons={
              <QuoteButtons
                onCopy={copyQuote}
                onFavourite={handleFavourite}
                onShare={() => setQuoteState((prev) => ({ ...prev, shareModal: true }))}
                isFavourited={quoteState.isFavourited}
              />
            }
          />
        </div>
      )}
    </div>
  );
};

export { Quote as default, Quote };
