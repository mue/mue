export function isValidUrl(url) {
  // regex: https://ihateregex.io/expr/url/
  // eslint-disable-next-line no-useless-escape
  const urlRegex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,63}\b([-a-zA-Z0-9()!@:%_.~#?&=]*)/;

  return urlRegex.test(url);
}
