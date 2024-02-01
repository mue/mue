const getTitleFromUrl = async (url) => {
  let title;
  try {
    let response = await fetch(url);
    if (response.redirected) {
      response = await fetch(response.url);
    }
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    title = doc.title;
  } catch (e) {
    title = url;
  }

  return title;
};

const isValidUrl = (url) => {
  // regex: https://ihateregex.io/expr/url/
  // eslint-disable-next-line no-useless-escape
  const urlRegex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_.~#?&=]*)/;

  return urlRegex.test(url);
};

export { getTitleFromUrl, isValidUrl };
