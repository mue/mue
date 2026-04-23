export const quotePackHandler = {
  install: (packData, context) => {
    const currentQuotes = JSON.parse(localStorage.getItem('quote_packs')) || [];
    packData.quotes.forEach((quote) => {
      currentQuotes.push(quote);
    });
    localStorage.setItem('quote_packs', JSON.stringify(currentQuotes));

    if (localStorage.getItem('quoteType') !== 'quote_pack') {
      localStorage.setItem('oldQuoteType', localStorage.getItem('quoteType'));
    }
    localStorage.setItem('quoteType', 'quote_pack');
    localStorage.removeItem('quotechange');
    localStorage.removeItem('quoteQueue');
    localStorage.removeItem('currentQuote');

    return { refreshEvent: 'quote' };
  },

  uninstall: (packData, context) => {
    let installedContents = JSON.parse(localStorage.getItem('quote_packs')) || [];

    if (packData && packData.quotes) {
      installedContents = installedContents.filter((item) => {
        return !packData.quotes.some(
          (content) => content.quote === item.quote && content.author === item.author,
        );
      });
    }
    localStorage.setItem('quote_packs', JSON.stringify(installedContents));

    if (installedContents.length === 0) {
      localStorage.setItem('quoteType', localStorage.getItem('oldQuoteType') || 'api');
      localStorage.removeItem('oldQuoteType');
      localStorage.removeItem('quote_packs');
    }
    localStorage.removeItem('quotechange');
    localStorage.removeItem('quoteQueue');
    localStorage.removeItem('currentQuote');

    return { refreshEvent: 'marketplacequoteuninstall' };
  },
};
