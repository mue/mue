import { useCallback } from 'react';
import variables from 'config/variables';
import offline_quotes from '../offline_quotes.json';
import { shouldUpdateByFrequency, resetStartTime } from 'utils/frequencyManager';
import { safeParseJSON } from 'utils/jsonStorage';
import { useCachedFetch } from 'hooks/useCachedFetch';
import { QueueManager } from 'utils/backgroundQueue';

/**
 * Custom hook for loading quote data from various sources
 */
export function useQuoteLoader(updateQuote) {
  // Initialize cache hook for author images
  const { fetchWithCache: fetchAuthorImage } = useCachedFetch({
    cacheKey: 'authorImageCache',
    timestampKey: 'authorImageCacheTimestamp',
    expiryDays: 7,
  });

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
          `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${author}&origin=*&prop=pageimages&format=json&pithumbsize=100`,
        ).then((res) => res.json());

        const authorPage = Object.values(pageData.query.pages)[0];
        const authorimg = authorPage?.thumbnail?.source;

        if (!authorimg) {
          return { authorimg: null, authorimglicense: null };
        }

        const licenseData = await fetch(
          `https://${lang}.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=extmetadata&titles=File:${authorPage.pageimage}&origin=*&format=json`,
        ).then((res) => res.json());

        const licensePage = Object.values(licenseData.query.pages)[0];
        const metadata = licensePage?.imageinfo?.[0]?.extmetadata;
        const license = metadata?.LicenseShortName;
        const photographer = stripHTML(
          metadata?.Attribution?.value || metadata?.Artist?.value || '',
        )
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

  // Get cached author image or fetch and cache it
  const getCachedAuthorImg = useCallback(
    async (author) => {
      if (localStorage.getItem('authorImg') === 'false' || author === 'Unknown') {
        return { authorimg: null, authorimglicense: null };
      }

      return await fetchAuthorImage(author, async () => {
        const result = await getAuthorImg(author);
        // Return only if we have actual data
        return result.authorimg || result.authorimglicense ? result : null;
      });
    },
    [fetchAuthorImage, getAuthorImg],
  );

  // Select raw quote data without author images (non-blocking)
  const selectQuoteData = useCallback(() => {
    const offline = localStorage.getItem('offlineMode') === 'true';
    let type = localStorage.getItem('quoteType') || 'quote_pack';

    // Migrate deprecated 'api' type
    if (type === 'api') {
      type = 'quote_pack';
      localStorage.setItem('quoteType', 'quote_pack');
    }

    // Custom quotes
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

      if (!customQuote || customQuote.length === 0) {
        return { noQuote: true };
      }

      const selected = customQuote[Math.floor(Math.random() * customQuote.length)];
      return {
        quote: `"${selected.quote}"`,
        author: selected.author,
        authorlink: getAuthorLink(selected.author),
        needsAuthorImg: true,
        noQuote: false,
      };
    }

    // Quote packs or offline
    if (offline) {
      const quote = offline_quotes[Math.floor(Math.random() * offline_quotes.length)];
      return {
        quote: '"' + quote.quote + '"',
        author: quote.author,
        authorlink: getAuthorLink(quote.author),
        needsAuthorImg: false, // Offline quotes don't get author images
      };
    }

    const installed = JSON.parse(localStorage.getItem('installed') || '[]');
    const quotePack = installed
      .filter((item) => item.type === 'quotes')
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
        needsAuthorImg: false,
      };
    }

    const data = quotePack[Math.floor(Math.random() * quotePack.length)];
    const hasAuthor = data.author && data.author.trim() !== '';
    const displayAuthor = hasAuthor ? data.author : data.packName;

    return {
      quote: `"${data.quote}"`,
      author: displayAuthor,
      realAuthor: hasAuthor ? data.author : null, // For Wikipedia lookup
      authorlink: hasAuthor ? getAuthorLink(data.author) : null,
      fallbackauthorimg: data.fallbackauthorimg,
      needsAuthorImg: hasAuthor && !data.noAuthorImg,
    };
  }, [getAuthorLink]);

  // Fetch complete quote data including author image (for prefetching)
  const fetchCompleteQuote = useCallback(
    async (quoteData) => {
      if (!quoteData || quoteData.noQuote) return quoteData;

      // If author image is needed, fetch it
      if (quoteData.needsAuthorImg) {
        const authorToLookup = quoteData.realAuthor || quoteData.author;
        try {
          const authorImgData = await getCachedAuthorImg(authorToLookup);

          // For quote packs, use fallback if Wikipedia fails
          if (!authorImgData.authorimg && quoteData.fallbackauthorimg) {
            return {
              ...quoteData,
              authorimg: quoteData.fallbackauthorimg,
              authorimglicense: null,
            };
          }

          return {
            ...quoteData,
            ...authorImgData,
          };
        } catch (e) {
          console.error('Failed to fetch author image:', e);
          // Return quote data with fallback or no image
          return {
            ...quoteData,
            authorimg: quoteData.fallbackauthorimg || null,
            authorimglicense: null,
          };
        }
      }

      return quoteData;
    },
    [getCachedAuthorImg],
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

    // Initialize prefetch storage on first access
    if (localStorage.getItem('quoteQueue') === null) {
      localStorage.setItem('quoteQueue', JSON.stringify([]));
    }
    if (localStorage.getItem('authorImageCache') === null) {
      localStorage.setItem('authorImageCache', JSON.stringify({}));
      localStorage.setItem('authorImageCacheTimestamp', Date.now().toString());
    }
    if (localStorage.getItem('quotePrefetchEnabled') === null) {
      localStorage.setItem('quotePrefetchEnabled', 'true');
    }

    // Check if we should update based on frequency
    if (!shouldUpdateByFrequency('quote')) {
      // Load cached quote without fetching new one
      const cached = localStorage.getItem('currentQuote');
      if (cached) {
        try {
          const cachedQuote = JSON.parse(cached);
          updateQuote(cachedQuote);
          return;
        } catch {
          // If cache invalid, continue to fetch new
        }
      }
    }

    // SPECIAL CASE: Favourite quote (highest priority, no queue)
    const favouriteQuote = localStorage.getItem('favouriteQuote');
    if (favouriteQuote) {
      const [quote, author] = favouriteQuote.split(' - ');

      // Display quote immediately
      updateQuote({
        quote,
        author,
        authorlink: getAuthorLink(author),
        authorimg: null, // Will be updated asynchronously
        authorimglicense: null,
      });

      // Fetch author image asynchronously (non-blocking)
      getCachedAuthorImg(author).then((authorimgdata) => {
        updateQuote({
          quote,
          author,
          authorlink: getAuthorLink(author),
          ...authorimgdata,
        });
      });

      return; // Don't use queue for favourite quotes
    }

    // MAIN FLOW: Use queue system
    const queueManager = new QueueManager('quoteQueue', 3);
    const cachedQueue = queueManager.getQueue();
    let quoteData;

    // Step 1: Try to get from queue
    if (cachedQueue.length > 0) {
      quoteData = queueManager.shift();
    } else {
      // Step 2: No queue, fetch new quote immediately
      const rawQuote = selectQuoteData();
      if (rawQuote.noQuote) {
        return updateQuote({ noQuote: true });
      }

      // For non-queue fetch, display immediately then enhance with author image
      if (rawQuote.needsAuthorImg) {
        // Display quote text immediately
        updateQuote({
          ...rawQuote,
          authorimg: rawQuote.fallbackauthorimg || null,
          authorimglicense: null,
        });

        // Fetch author image asynchronously
        const authorToLookup = rawQuote.realAuthor || rawQuote.author;
        getCachedAuthorImg(authorToLookup).then((authorImgData) => {
          updateQuote({
            ...rawQuote,
            ...(authorImgData.authorimg
              ? authorImgData
              : {
                  authorimg: rawQuote.fallbackauthorimg || null,
                  authorimglicense: null,
                }),
          });
        });

        quoteData = rawQuote; // Use for prefetch reference
      } else {
        quoteData = rawQuote;
        updateQuote(quoteData);
      }
    }

    // Step 3: Display current quote (if from queue, it's already complete)
    if (cachedQueue.length > 0 || !quoteData.needsAuthorImg) {
      updateQuote(quoteData);
    }

    // Step 4: Store current quote and reset timestamp
    try {
      localStorage.setItem('currentQuote', JSON.stringify(quoteData));
      resetStartTime('quote'); // Reset timestamp after successfully updating quote
    } catch (e) {
      console.warn('Could not save currentQuote to localStorage:', e);
    }

    // Step 5: Prefetch next 3 quotes asynchronously (non-blocking)
    if (queueManager.needsPrefetch() && !offline) {
      const spaceNeeded = queueManager.getSpaceNeeded();

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
    }
  }, [updateQuote, getAuthorLink, getCachedAuthorImg, selectQuoteData, fetchCompleteQuote]);

  return {
    getQuote,
  };
}
