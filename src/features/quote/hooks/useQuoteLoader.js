import { useCallback } from 'react';
import variables from 'config/variables';
import offline_quotes from '../offline_quotes.json';

/**
 * Custom hook for loading quote data from various sources
 */
export function useQuoteLoader(updateQuote) {
  const getAuthorLink = useCallback((author) => {
    return localStorage.getItem('authorLink') === 'false' || author === 'Unknown'
      ? null
      : `https://${variables.languagecode.split('_')[0]}.wikipedia.org/wiki/${author
          .split(' ')
          .join('_')}`;
  }, []);

  const stripHTML = useCallback((html) => {
    const tmpdoc = new DOMParser().parseFromString(html, 'text/html');
    return tmpdoc.body.textContent || '';
  }, []);

  const getAuthorImg = useCallback(
    async (author) => {
      if (localStorage.getItem('authorImg') === 'false' || author === 'Unknown') {
        return { authorimg: null, authorimglicense: null };
      }

      try {
        const lang = variables.languagecode.split('_')[0];
        const pageData = await fetch(
          `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${author}&origin=*&prop=pageimages&format=json&pithumbsize=100`
        ).then(res => res.json());

        const authorPage = Object.values(pageData.query.pages)[0];
        const authorimg = authorPage?.thumbnail?.source;

        if (!authorimg) {
          return { authorimg: null, authorimglicense: null };
        }

        const licenseData = await fetch(
          `https://${lang}.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=extmetadata&titles=File:${authorPage.pageimage}&origin=*&format=json`
        ).then(res => res.json());

        const licensePage = Object.values(licenseData.query.pages)[0];
        const metadata = licensePage?.imageinfo?.[0]?.extmetadata;
        const license = metadata?.LicenseShortName;
        const photographer = stripHTML(metadata?.Attribution?.value || metadata?.Artist?.value || '')
          .replace(/©\s/, '')
          .replace(/ \(talk\)/, '');

        if (!photographer) {
          return { authorimg: null, authorimglicense: null };
        }

        if (license?.value === 'Public domain') {
          return { authorimg, authorimglicense: null };
        }

        const authorimglicense = photographer
          ? `© ${photographer}${license ? `. ${license.value}` : ''}`.replace(/copyright\s/i, '')
          : license?.value || null;

        return { authorimg, authorimglicense };
      } catch (e) {
        console.error(e);
        return { authorimg: null, authorimglicense: null };
      }
    },
    [stripHTML],
  );

  const doOffline = useCallback(() => {
    const quote = offline_quotes[Math.floor(Math.random() * offline_quotes.length)];

    updateQuote({
      quote: '"' + quote.quote + '"',
      author: quote.author,
      authorlink: getAuthorLink(quote.author),
      authorimg: '',
    });
  }, [updateQuote, getAuthorLink]);

  const getQuote = useCallback(async () => {
    const offline = localStorage.getItem('offlineMode') === 'true';
    const type = localStorage.getItem('quoteType') || 'api';

    // Check for favourite quote first
    const favouriteQuote = localStorage.getItem('favouriteQuote');
    if (favouriteQuote) {
      const [quote, author] = favouriteQuote.split(' - ');
      const authorimgdata = await getAuthorImg(author);
      return updateQuote({
        quote,
        author,
        authorlink: getAuthorLink(author),
        ...authorimgdata,
      });
    }

    switch (type) {
      case 'custom': {
        let customQuote;
        try {
          customQuote = JSON.parse(localStorage.getItem('customQuote'));
        } catch {
          // Migrate old format
          customQuote = [{
            quote: localStorage.getItem('customQuote'),
            author: localStorage.getItem('customQuoteAuthor'),
          }];
          localStorage.setItem('customQuote', JSON.stringify(customQuote));
        }

        if (!customQuote || customQuote.length === 0) {
          return updateQuote({ noQuote: true });
        }

        const selected = customQuote[Math.floor(Math.random() * customQuote.length)];
        const authorimgdata = await getAuthorImg(selected.author);
        
        return updateQuote({
          quote: `"${selected.quote}"`,
          author: selected.author,
          authorlink: getAuthorLink(selected.author),
          ...authorimgdata,
          noQuote: false,
        });
      }

      case 'quote_pack': {
        if (offline) return doOffline();

        const installed = JSON.parse(localStorage.getItem('installed') || '[]');
        const quotePack = installed
          .filter(item => item.type === 'quotes')
          .flatMap(item => item.quotes.map(quote => ({
            ...quote,
            fallbackauthorimg: item.icon_url,
          })));

        if (quotePack.length === 0) return doOffline();

        const data = quotePack[Math.floor(Math.random() * quotePack.length)];
        return updateQuote({
          quote: `"${data.quote}"`,
          author: data.author,
          authorlink: getAuthorLink(data.author),
          authorimg: data.fallbackauthorimg,
        });
      }

      case 'api': {
        if (offline) return doOffline();

        const fetchAPIQuote = async () => {
          const quoteLanguage = localStorage.getItem('quoteLanguage');
          const response = await fetch(
            `${variables.constants.API_URL}/quotes/random?language=${quoteLanguage}`
          ).then(res => res.json());

          if (response.statusCode === 429) return null;

          const authorimgdata = await getAuthorImg(response.author);
          return {
            quote: `"${response.quote.replace(/\s+$/g, '')}"`,
            author: response.author,
            authorlink: getAuthorLink(response.author),
            ...authorimgdata,
            quoteLanguage,
            authorOccupation: response.author_occupation,
          };
        };

        try {
          const data = JSON.parse(localStorage.getItem('nextQuote')) || await fetchAPIQuote();
          localStorage.setItem('nextQuote', null);
          
          if (data) {
            updateQuote(data);
            localStorage.setItem('currentQuote', JSON.stringify(data));
            localStorage.setItem('nextQuote', JSON.stringify(await fetchAPIQuote()));
          } else {
            doOffline();
          }
        } catch {
          doOffline();
        }
        break;
      }
    }
  }, [updateQuote, getAuthorLink, getAuthorImg, doOffline]);

  return {
    getQuote,
  };
}
