import { useCallback } from 'react';
import variables from 'config/variables';
import offline_quotes from '../offline_quotes.json';
import { shouldUpdateByFrequency, resetStartTime } from 'utils/frequencyManager';
import { QueueManager } from 'utils/backgroundQueue';
import { fetchAuthorFromWikidata } from 'utils/wikidata/wikidataAuthorFetcher';

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

  /**
   * Fetch author data from Wikidata (image, occupation, description, etc.)
   * @param {string} author - Author name
   * @returns {Promise<object>} Author data including image, occupation, and license info
   */
  const getAuthorDataFromWikidata = useCallback(
    async (author) => {
      if (localStorage.getItem('authorImg') === 'false' || author === 'Unknown') {
        return {
          authorimg: null,
          authorimglicense: null,
          authorOccupation: null,
          authorlink: null,
        };
      }

      try {
        const lang = variables.languagecode.split('_')[0];
        const wikidataResult = await fetchAuthorFromWikidata(author, lang);

        if (!wikidataResult) {
          return {
            authorimg: null,
            authorimglicense: null,
            authorOccupation: null,
            authorlink: getAuthorLink(author),
          };
        }

        return {
          authorimg: wikidataResult.imageUrl || null,
          authorimglicense: wikidataResult.imageLicense || null,
          authorOccupation: wikidataResult.occupation || null,
          authorlink: wikidataResult.wikipediaLink || getAuthorLink(author),
        };
      } catch (e) {
        console.error('Error fetching author data from Wikidata:', e);
        return {
          authorimg: null,
          authorimglicense: null,
          authorOccupation: null,
          authorlink: getAuthorLink(author),
        };
      }
    },
    [getAuthorLink],
  );

  const stripHTML = useCallback((html) => {
    const tmpdoc = new DOMParser().parseFromString(html, 'text/html');
    return tmpdoc.body.textContent || '';
  }, []);

  const getCachedAuthorData = useCallback(
    async (author) => {
      if (localStorage.getItem('authorImg') === 'false' || author === 'Unknown') {
        return {
          authorimg: null,
          authorimglicense: null,
          authorOccupation: null,
          authorlink: null,
        };
      }

      return await getAuthorDataFromWikidata(author);
    },
    [getAuthorDataFromWikidata],
  );

  const selectQuoteData = useCallback(() => {
    const offline = localStorage.getItem('offlineMode') === 'true';
    let type = localStorage.getItem('quoteType') || 'quote_pack';

    if (type === 'api') {
      type = 'quote_pack';
      localStorage.setItem('quoteType', 'quote_pack');
    }

    if (type === 'custom') {
      let customQuote;
      try {
        customQuote = JSON.parse(localStorage.getItem('customQuote'));
      } catch {
        customQuote = [
          {
            quote: localStorage.getItem('customQuote'),
            author: localStorage.getItem('customQuoteAuthor'),
          },
        ];
      }

      const validQuotes = customQuote?.filter((q) => q.quote && q.quote.trim() !== '') || [];

      if (validQuotes.length === 0) {
        return { noQuote: true };
      }

      const selected = validQuotes[Math.floor(Math.random() * validQuotes.length)];
      return {
        quote: `"${selected.quote}"`,
        author: selected.author || 'Unknown',
        authorlink: getAuthorLink(selected.author),
        needsAuthorData: true,
        noQuote: false,
      };
    }

    if (offline) {
      const quote = offline_quotes[Math.floor(Math.random() * offline_quotes.length)];
      return {
        quote: '"' + quote.quote + '"',
        author: quote.author,
        authorlink: getAuthorLink(quote.author),
        needsAuthorData: false,
      };
    }

    const installed = JSON.parse(localStorage.getItem('installed') || '[]');
    const enabledPacks = JSON.parse(localStorage.getItem('enabledPacks') || '{}');
    const quotePack = installed
      .filter((item) => {
        if (item.type !== 'quotes') {
          return false;
        }
        const packId = item.id || item.name;
        return enabledPacks[packId] !== false;
      })
      .flatMap((item) =>
        item.quotes.map((quote) => ({
          ...quote,
          fallbackauthorimg: item.icon_url,
          packName: item.display_name || item.name,
          noAuthorImg: item.noAuthorImg || quote.noAuthorImg,
        })),
      );

    if (quotePack.length === 0) {
      const quote = offline_quotes[Math.floor(Math.random() * offline_quotes.length)];
      return {
        quote: '"' + quote.quote + '"',
        author: quote.author,
        authorlink: getAuthorLink(quote.author),
        needsAuthorData: false,
      };
    }

    const data = quotePack[Math.floor(Math.random() * quotePack.length)];
    const hasAuthor = data.author && data.author.trim() !== '';
    const displayAuthor = hasAuthor ? data.author : data.packName;

    return {
      quote: `"${data.quote}"`,
      author: displayAuthor,
      realAuthor: hasAuthor ? data.author : null,
      authorlink: hasAuthor ? getAuthorLink(data.author) : null,
      fallbackauthorimg: data.fallbackauthorimg,
      needsAuthorData: hasAuthor && !data.noAuthorImg,
    };
  }, [getAuthorLink]);

  const fetchCompleteQuote = useCallback(
    async (quoteData) => {
      if (!quoteData || quoteData.noQuote) return quoteData;

      if (quoteData.needsAuthorData) {
        const authorToLookup = quoteData.realAuthor || quoteData.author;
        try {
          const authorData = await getCachedAuthorData(authorToLookup);

          if (!authorData.authorimg && quoteData.fallbackauthorimg) {
            return {
              ...quoteData,
              authorimg: quoteData.fallbackauthorimg,
              authorimglicense: null,
              authorOccupation: authorData.authorOccupation || null,
              authorlink: authorData.authorlink || quoteData.authorlink,
            };
          }

          return {
            ...quoteData,
            ...authorData,
          };
        } catch (e) {
          console.error('Failed to fetch author data:', e);
          return {
            ...quoteData,
            authorimg: quoteData.fallbackauthorimg || null,
            authorimglicense: null,
            authorOccupation: null,
          };
        }
      }

      return quoteData;
    },
    [getCachedAuthorData],
  );

  const doOffline = useCallback(() => {
    const quote = offline_quotes[Math.floor(Math.random() * offline_quotes.length)];

    updateQuote({
      quote: '"' + quote.quote + '"',
      author: quote.author,
      authorlink: getAuthorLink(quote.author),
      authorimg: '',
      authorOccupation: null,
    });
  }, [updateQuote, getAuthorLink]);

  const getQuote = useCallback(async () => {
    const offline = localStorage.getItem('offlineMode') === 'true';

    if (localStorage.getItem('quoteQueue') === null) {
      localStorage.setItem('quoteQueue', JSON.stringify([]));
    }
    if (localStorage.getItem('quotePrefetchEnabled') === null) {
      localStorage.setItem('quotePrefetchEnabled', 'true');
    }

    if (!shouldUpdateByFrequency('quote')) {
      const cached = localStorage.getItem('currentQuote');
      if (cached) {
        try {
          const cachedQuote = JSON.parse(cached);
          updateQuote(cachedQuote);
          return;
        } catch {
        }
      }
    }

    const favouriteQuote = localStorage.getItem('favouriteQuote');
    if (favouriteQuote) {
      const [quote, author] = favouriteQuote.split(' - ');

      updateQuote({
        quote,
        author,
        authorlink: getAuthorLink(author),
        authorimg: null,
        authorimglicense: null,
        authorOccupation: null,
      });

      getCachedAuthorData(author).then((authorData) => {
        updateQuote({
          quote,
          author,
          authorlink: authorData.authorlink || getAuthorLink(author),
          ...authorData,
        });
      });

      return;
    }

    const queueManager = new QueueManager('quoteQueue', 3);
    const cachedQueue = queueManager.getQueue();
    let quoteData;

    if (cachedQueue.length > 0) {
      quoteData = queueManager.shift();
    } else {
      const rawQuote = selectQuoteData();
      if (rawQuote.noQuote) {
        return updateQuote({ noQuote: true });
      }

      if (rawQuote.needsAuthorData) {
        updateQuote({
          ...rawQuote,
          authorimg: rawQuote.fallbackauthorimg || null,
          authorimglicense: null,
          authorOccupation: null,
        });

        setTimeout(() => {
          const authorToLookup = rawQuote.realAuthor || rawQuote.author;
          getCachedAuthorData(authorToLookup).then((authorData) => {
            updateQuote({
              ...rawQuote,
              ...(authorData.authorimg
                ? authorData
                : {
                    authorimg: rawQuote.fallbackauthorimg || null,
                    authorimglicense: null,
                    authorOccupation: authorData.authorOccupation || null,
                    authorlink: authorData.authorlink || rawQuote.authorlink,
                  }),
            });
          });
        }, 0);

        quoteData = rawQuote;
      } else {
        quoteData = rawQuote;
        updateQuote(quoteData);
      }
    }

    if (cachedQueue.length > 0 || !quoteData.needsAuthorData) {
      updateQuote(quoteData);
    }

    try {
      localStorage.setItem('currentQuote', JSON.stringify(quoteData));
      resetStartTime('quote');
    } catch (e) {
      console.warn('Could not save currentQuote to localStorage:', e);
    }

    if (queueManager.needsPrefetch() && !offline) {
      const spaceNeeded = queueManager.getSpaceNeeded();

      setTimeout(() => {
        Promise.all(
          Array.from({ length: spaceNeeded }, async () => {
            const rawQuote = selectQuoteData();
            if (rawQuote.noQuote) return null;
            return await fetchCompleteQuote(rawQuote);
          }),
        )
          .then((newQuotes) => {
            const validQuotes = newQuotes.filter(Boolean);
            if (validQuotes.length > 0) {
              queueManager.push(validQuotes);
            }
          })
          .catch((error) => {
            console.error('Failed to prefetch quotes:', error);
          });
      }, 100);
    }
  }, [updateQuote, getAuthorLink, getCachedAuthorData, selectQuoteData, fetchCompleteQuote]);

  return {
    getQuote,
  };
}
