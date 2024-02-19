// based on https://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links
export function urlParser(input) {
  const urlPattern =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,63}\b([-a-zA-Z0-9()!@:%_+.~#?&//=]*)/g;
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

  const replaceUrl = (url) => `<br/><a class="link" href="${url}" target="_blank">${url}</a>`;
  const replaceEmail = (email) => `<a class="link" href="mailto:${email}">${email}</a>`;

  const replacedUrls = input.replace(urlPattern, replaceUrl);
  const replacedEmails = replacedUrls.replace(emailPattern, replaceEmail);
  return replacedEmails;
}
