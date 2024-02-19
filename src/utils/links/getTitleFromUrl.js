export async function getTitleFromUrl(url) {
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
}
